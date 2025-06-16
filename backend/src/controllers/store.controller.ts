import { Request, Response } from "express"
import { prisma } from "../db"

interface StoreQueryParams {
  page?: string
  limit?: string
  search?: string
  sortByRating?: "asc" | "desc" | ""
}

// get overview for store owner
export const getStoreOverview = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const ownerId = parseInt(String((req.user as any)?.id))

    if (isNaN(ownerId)) {
      return res.status(400).json({ error: "Invalid owner ID" })
    }

    //
    const store = await prisma.store.findFirst({
      where: {
        ownerId,
      },
      include: {
        ratings: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!store) {
      return res.status(404).json({ error: "Store not found for this owner" })
    }

    // total count and average rating
    const ratingStats = await prisma.rating.aggregate({
      where: { storeId: store.id },
      _count: { id: true },
      _avg: { rating: true },
    })

    const totalRatings = ratingStats._count.id
    const averageRating = ratingStats._avg.rating || 0

    // get 10 recent ratings
    const recentRatings = store.ratings.slice(0, 10).map((r) => ({
      id: r.id,
      userName: r.user.name,
      rating: r.rating,
      createdAt: r.createdAt,
    }))

    return res.status(200).json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
      },
      totalRatings,
      averageRating,
      recentRatings,
    })
  } catch (err) {
    console.error("Error fetching store overview:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// get ratings to display to store owner
export const getStoreRatings = async (
  req: Request,
  res: Response
): Promise<any> => {
  const storeId = parseInt(req.params.storeId)
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10

  const skip = (page - 1) * limit

  try {
    // get ratings
    const [ratingStats, ratings] = await Promise.all([
      prisma.rating.aggregate({
        where: { storeId: storeId },
        _count: { id: true },
        _avg: { rating: true },
      }),
      prisma.rating.findMany({
        where: { storeId: storeId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, email: true, address: true },
          },
        },
      }),
    ])

    const total = ratingStats._count.id
    const averageRating = ratingStats._avg.rating || 0

    const formatted = ratings.map((r) => ({
      id: r.id,
      userName: r.user.name,
      userEmail: r.user.email,
      userAddress: r.user.address,
      rating: r.rating,
      createdAt: r.createdAt,
    }))

    return res.json({
      ratings: formatted,
      averageRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch ratings" })
  }
}

// get stores to display to user and system_admin
export const getStores = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sortByRating = "",
    }: StoreQueryParams = req.query

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const where = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { address: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    }

    const [stores, ratingStats] = await Promise.all([
      prisma.store.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          address: true,
          createdAt: true,
          owner: { select: { name: true } },
        },
      }),
      prisma.rating.groupBy({
        by: ["storeId"],
        where: {
          store: where,
        },
        _count: { id: true },
        _avg: { rating: true },
      }),
    ])

    // Create a map for quick lookup of rating stats
    const ratingStatsMap = new Map(
      ratingStats.map((stat) => [
        stat.storeId,
        {
          averageRating: Math.round((stat._avg.rating || 0) * 10) / 10,
          totalRatings: stat._count.id,
        },
      ])
    )

    // Compute final store data with rating stats
    const computedStores = stores.map((store) => {
      const stats = ratingStatsMap.get(store.id) || {
        averageRating: 0,
        totalRatings: 0,
      }

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        createdAt: store.createdAt,
        ownerName: store.owner.name,
        averageRating: stats.averageRating,
        totalRatings: stats.totalRatings,
      }
    })

    // Sort by rating
    if (sortByRating === "asc") {
      computedStores.sort((a, b) => a.averageRating - b.averageRating)
    } else if (sortByRating === "desc") {
      computedStores.sort((a, b) => b.averageRating - a.averageRating)
    }

    // Paginate after sorting
    const paginatedStores = computedStores.slice(skip, skip + limitNum)

    return res.status(200).json({
      stores: paginatedStores,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: computedStores.length,
        pages: Math.ceil(computedStores.length / limitNum),
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export const getUserReviewsController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId } = req.params
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 5
    const skip = (page - 1) * limit

    const [total, reviews] = await Promise.all([
      prisma.rating
        .aggregate({
          where: { userId: parseInt(userId) },
          _count: { id: true },
        })
        .then((result) => result._count.id),
      prisma.rating.findMany({
        where: { userId: parseInt(userId) },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          rating: true,
          createdAt: true,
          store: {
            select: {
              name: true,
              address: true,
            },
          },
        },
      }),
    ])

    return res.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Failed to fetch user reviews" })
  }
}

//submit rating
export const submitRatingController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { storeId, rating } = req.body
  try {
    // Validate input
    if (!storeId || !rating || typeof rating !== "number") {
      return res.status(400).json({ message: "Invalid input" })
    }

    // Ensure user is authenticated
    const userId = (req.user as any)?.id
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Check if rating already exists for this user and store
    const existingRating = await prisma.rating.findFirst({
      where: { storeId, userId },
    })

    if (existingRating) {
      return res.status(400).json({ message: "Rating already exists" })
    }

    // insert new rating
    await prisma.rating.create({
      data: {
        storeId,
        userId,
        rating,
      },
    })

    return res.status(201).json({
      message: "Rating submitted successfully",
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Failed to submit rating" })
  }
}

//update rating
export const updateRating = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = parseInt(String(req.user?.id))
    const { reviewId, rating } = req.body

    if (!reviewId || typeof rating !== "number") {
      return res.status(400).json({ message: "Invalid input" })
    }

    // check review exists
    const existingReview = await prisma.rating.findUnique({
      where: { id: reviewId },
    })

    if (!existingReview || existingReview.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized or review not found" })
    }

    // Update review with new rating
    const updatedReview = await prisma.rating.update({
      where: { id: reviewId },
      data: {
        rating,
        updatedAt: new Date(),
      },
    })

    return res.status(200).json({ review: updatedReview })
  } catch (error) {
    console.error("Error updating review:", error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}
