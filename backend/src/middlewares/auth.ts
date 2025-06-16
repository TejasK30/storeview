import { prisma } from "../db"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface JwtPayload {
  userId: string
  role: "system_admin" | "store_owner" | "user"
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
