import { prisma } from "../db"
import { Request, Response } from "express"
import bcrypt from "bcrypt"

export interface QueryParams {
  page?: string
  limit?: string
  search?: string
  role?: string
}

export interface StoreQueryParams extends QueryParams {
  // "asc" | "desc"
  sortByRating?: string
}

// get quick stats for the admin dashboard
export const adminDashboardStats = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ])

    return res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// get stores
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

    const rawStores = await prisma.store.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        createdAt: true,
        owner: { select: { name: true } },
        ratings: { select: { rating: true } },
      },
    })

    const computedStores = rawStores.map((store) => {
      const ratings = store.ratings.map((r) => r.rating)
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        createdAt: store.createdAt,
        ownerName: store.owner.name,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings: ratings.length,
      }
    })

    // Sort by rating
    if (sortByRating === "asc") {
      computedStores.sort((a, b) => a.averageRating - b.averageRating)
    } else if (sortByRating === "desc") {
      computedStores.sort((a, b) => b.averageRating - a.averageRating)
    }

    // Pagination after sorting
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


