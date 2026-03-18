import { prisma } from "../db"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

type Role = "system_admin" | "store_owner" | "user"

interface JwtPayload {
  userId: string
  role: Role
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: "Access token missing" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    const user = await prisma.user.findUnique({
      where: { id: Number(decoded.userId) },
    })

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = { id: Number(user.id), email: user.email, role: user.role }
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

export const authorizeRole = (requiredRoles: Role | Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (req.user) {
        const userRole: Role = req.user.role as Role
        const allowedRoles = Array.isArray(requiredRoles)
          ? requiredRoles
          : [requiredRoles]

        if (!allowedRoles.includes(userRole)) {
          res
            .status(403)
            .json({ message: "Forbidden: insufficient privileges" })
          return
        }
      }

      next()
    } catch (error) {
      console.error("Token verification error:", error)
      res.status(401).json({ message: "Invalid token" })
    }
  }
}
