import { Request, Response } from "express"
import { prisma } from "../db"
import bcrypt from 'bcrypt'

interface StoreQueryParams {
  page?: string
  limit?: string
  search?: string
  sortByRating?: "asc" | "desc" | ""
}

class StoreController {
  // get overview for store owner
  async getStoreOverview(
    req: Request,
    res: Response
  ): Promise<any>{
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

  // get stores to display to user and system_admin
  async getStores (req: Request, res: Response): Promise<any> {
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

  // add store
  async addStore (req: Request, res: Response): Promise<any>{
    try {
      const { storeName, storeEmail, storeAddress, newOwner } = req.body
  
      const existingStore = await prisma.store.findUnique({
        where: { email: storeEmail },
      })
  
      if (existingStore) {
        return res.status(400).json({ message: "Store email already exists" })
      }
  
      const existingOwner = await prisma.user.findUnique({
        where: { email: newOwner.email },
      })
  
      if (existingOwner) {
        return res.status(400).json({ message: "Owner email already exists" })
      }
  
      const hashedPassword = await bcrypt.hash(newOwner.password, 10)
      await prisma.store.create({
        data: {
          name: storeName,
          email: storeEmail,
          address: storeAddress,
          owner: {
            create: {
              name: newOwner.name,
              email: newOwner.email,
              password: hashedPassword,
              address: newOwner.address,
              role: "store_owner",
              createdById: req.user?.id,
            },
          },
        },
      })
  
      return res.status(201).json({
        message: "Store and owner created successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Something went wrong" })
    }
  }
}

export default StoreController