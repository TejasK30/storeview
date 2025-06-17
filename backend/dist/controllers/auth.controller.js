"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.updateUser = exports.getProfile = exports.loginUser = exports.registerUser = void 0;
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Register a new user
const registerUser = async (req, res) => {
    const { name, email, password, role, address, storeName } = req.body;
    try {
        // Check if user already exists
        const existingUser = await db_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }
        // password hashing
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Create user
        const newUser = await db_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                address,
                store: role === "store_owner"
                    ? {
                        create: {
                            name: storeName,
                            email: email,
                            address: address,
                            createdBy: {
                                connect: { id: 0 },
                            },
                        },
                    }
                    : undefined,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        // Set cookie
        res.cookie("token", token, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res
            .status(201)
            .json({ message: "User registered successfully", userId: newUser.id });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.registerUser = registerUser;
// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await db_1.prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
            return res.status(400).json({ message: "User does not exist!" });
        }
        // Compare password
        const isMatch = await bcrypt_1.default.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: existingUser.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.cookie("token", token, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Login successful",
            role: existingUser.role,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.loginUser = loginUser;
// Get current user's profile
const getProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await db_1.prisma.user.findUnique({
            where: { id: Number(req.user.id) },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                store: req.user && req.user.role === "store_owner"
                    ? {
                        select: {
                            id: true,
                            name: true,
                        },
                    }
                    : false,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    }
    catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getProfile = getProfile;
const updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const updatedUser = await db_1.prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                password: password ? await bcrypt_1.default.hash(password, 10) : undefined,
            },
        });
        res.json(updatedUser);
    }
    catch (err) {
        console.error("User update error:", err);
        res.status(500).json({ message: "Failed to update user" });
    }
};
exports.updateUser = updateUser;
//logout user
const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        req.user = undefined; // Clear user from request
        return res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.logout = logout;
