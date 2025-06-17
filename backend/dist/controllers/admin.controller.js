"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStore = exports.addUser = exports.getStores = exports.getUsers = exports.adminDashboardStats = void 0;
const db_1 = require("../db");
const bcrypt_1 = __importDefault(require("bcrypt"));
// get quick stats for the admin dashboard
const adminDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            db_1.prisma.user.count(),
            db_1.prisma.store.count(),
            db_1.prisma.rating.count(),
        ]);
        return res.status(200).json({
            totalUsers,
            totalStores,
            totalRatings,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.adminDashboardStats = adminDashboardStats;
// get users
const getUsers = async (req, res) => {
    try {
        const { page = "1", limit = "10", search = "", role, sortBy = "createdAt", sortOrder = "desc", } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = {
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            }),
            ...(role && role !== "all" && { role: role }),
        };
        const allowedSortFields = ["name", "email", "createdAt"];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
        const sortDirection = sortOrder === "asc" ? "asc" : "desc";
        const [users, total] = await Promise.all([
            db_1.prisma.user.findMany({
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
            db_1.prisma.user.count({ where }),
        ]);
        return res.status(200).json({
            users,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.getUsers = getUsers;
// get stores
const getStores = async (req, res) => {
    try {
        const { page = "1", limit = "10", search = "", sortByRating = "", } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = {
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                    { address: { contains: search, mode: "insensitive" } },
                ],
            }),
        };
        const rawStores = await db_1.prisma.store.findMany({
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
        });
        const computedStores = rawStores.map((store) => {
            const ratings = store.ratings.map((r) => r.rating);
            const averageRating = ratings.length > 0
                ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
                : 0;
            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                createdAt: store.createdAt,
                ownerName: store.owner.name,
                averageRating: Math.round(averageRating * 10) / 10,
                totalRatings: ratings.length,
            };
        });
        // Sort by rating
        if (sortByRating === "asc") {
            computedStores.sort((a, b) => a.averageRating - b.averageRating);
        }
        else if (sortByRating === "desc") {
            computedStores.sort((a, b) => b.averageRating - a.averageRating);
        }
        // Pagination after sorting
        const paginatedStores = computedStores.slice(skip, skip + limitNum);
        return res.status(200).json({
            stores: paginatedStores,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: computedStores.length,
                pages: Math.ceil(computedStores.length / limitNum),
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.getStores = getStores;
// add user
const addUser = async (req, res) => {
    const { name, email, password, address, role, storeName, storeAddress, storeEmail, } = req.body;
    try {
        const existingUser = await db_1.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await db_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                address,
                role,
                createdById: req.user?.id,
                store: role === "store_owner"
                    ? {
                        create: {
                            name: storeName,
                            email: storeEmail,
                            address: storeAddress,
                            createdBy: {
                                connect: { id: req.user?.id },
                            },
                        },
                    }
                    : undefined,
            },
        });
        return res.status(201).json({
            message: "User created successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.addUser = addUser;
// add store
const addStore = async (req, res) => {
    try {
        const { storeName, storeEmail, storeAddress, newOwner } = req.body;
        const existingStore = await db_1.prisma.store.findUnique({
            where: { email: storeEmail },
        });
        if (existingStore) {
            return res.status(400).json({ message: "Store email already exists" });
        }
        const existingOwner = await db_1.prisma.user.findUnique({
            where: { email: newOwner.email },
        });
        if (existingOwner) {
            return res.status(400).json({ message: "Owner email already exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(newOwner.password, 10);
        await db_1.prisma.store.create({
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
        });
        return res.status(201).json({
            message: "Store and owner created successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
exports.addStore = addStore;
