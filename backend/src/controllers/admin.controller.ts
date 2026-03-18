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
