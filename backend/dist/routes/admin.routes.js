"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// get quick stats for the admin dashboard
router.get("/stats", auth_1.authenticate, admin_controller_1.adminDashboardStats);
// get users
router.get("/users", auth_1.authenticate, admin_controller_1.getUsers);
// get stores
router.get("/stores", auth_1.authenticate, admin_controller_1.getStores);
// add user
router.post("/users", auth_1.authenticate, admin_controller_1.addUser);
// add store
router.post("/stores", auth_1.authenticate, admin_controller_1.addStore);
exports.default = router;
