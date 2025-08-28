import { prisma } from "../db"
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Register a new user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { name, email, password, role, address, storeName } = req.body
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" })
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        address,
      },
    })

    // If store owner registered → create store linked to them
    if (role === "store_owner") {
      await prisma.store.create({
        data: {
          name: storeName!,
          email,
          address,
          owner: { connect: { id: newUser.id } },
        },
      })
    }

    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    )

    // Set cookie
    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    })

    return res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser.id })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// Login user
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist!" })
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, existingUser.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { userId: existingUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    )

    res.cookie("token", token, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      message: "Login successful",
      role: existingUser.role,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

// Get current user's profile
export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        store:
          req.user && req.user.role === "store_owner"
            ? {
                select: {
                  id: true,
                  name: true,
                },
              }
            : false,
      },
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return res.status(500).json({ message: "Server error" })
  }
}

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const { name, email, password } = req.body as {
    name: string
    email: string
    password?: string
  }
  const userId = req.user?.id

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password: password ? await bcrypt.hash(password, 10) : undefined,
      },
    })
    res.json(updatedUser)
  } catch (err) {
    console.error("User update error:", err)
    res.status(500).json({ message: "Failed to update user" })
  }
}

//logout user
export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    req.user = undefined // Clear user from request
    return res.status(200).json({ message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
