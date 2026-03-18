import { prisma } from "../db"
import { Request, Response } from "express"
import bcrypt from "bcrypt"

export interface QueryParams {
  page?: string
  limit?: string
  search?: string
  role?: string
}

class UserController {
  // get users
  async getUsers (req: Request, res: Response): Promise<any> {
    try {
      const {
        page = "1",
        limit = "10",
        search = "",
        role,
        sortBy = "createdAt",
        sortOrder = "desc",
      }: QueryParams & { sortBy?: string; sortOrder?: "asc" | "desc" } = req.query

      const pageNum = parseInt(page)
      const limitNum = parseInt(limit)
      const skip = (pageNum - 1) * limitNum

      const where = {
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }),
        ...(role && role !== "all" && { role: role as any }),
      }

      const allowedSortFields = ["name", "email", "createdAt"]
      const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt"
      const sortDirection = sortOrder === "asc" ? "asc" : "desc"

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            address: true,
            createdAt: true,
          },
          skip,
          take: limitNum,
          orderBy: { [sortField]: sortDirection },
        }),
        prisma.user.count({ where }),
      ])

      return res.status(200).json({
        users,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Something went wrong" })
    }
  }

  // add user
  async addUser(req: Request, res: Response): Promise<any>{
    const {
      name,
      email,
      password,
      address,
      role,
      storeName,
      storeAddress,
      storeEmail,
    } = req.body
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          address,
          role,
          createdById: req.user?.id,
          store:
            role === "store_owner"
              ? {
                  create: {
                    name: storeName!,
                    email: storeEmail,
                    address: storeAddress,
                    createdBy: {
                      connect: { id: req.user?.id },
                    },
                  },
                }
              : undefined,
        },
      })

      return res.status(201).json({
        message: "User created successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: "Something went wrong" })
    }
  }
}

export default UserController