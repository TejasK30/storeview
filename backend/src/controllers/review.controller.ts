import { Request, Response } from "express"
import { prisma } from "../db"

class ReviewController {
  /**
   * @param req 
   * @param res 
   * @param storeId
   * @returns Reviews of store based on storeId
   */
  async getRatingsByStoreId (
    req: Request,
    res: Response
  ): Promise<any> {
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

  /**
   * @param req 
   * @param res 
   * @param {string} userId
   * @returns Reviews documents based on userId in Params
   */
  async getRatingsByUserId (
    req: Request,
    res: Response
  ): Promise<any> {
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

  /**
   * @param req 
   * @param res 
   * @returns created review / rating
   * Creates new record of review in Database
   */
  async createRating (
    req: Request,
    res: Response
  ): Promise<any> {
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

  /**
   * @param req 
   * @param res 
   * @returns updated rating 
   * Update record of review in Database
   */
  async updateRating (
    req: Request,
    res: Response
  ): Promise<any> {
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
}

export default ReviewController