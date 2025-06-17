"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middlewares/auth");
const auth_controller_1 = require("../controllers/auth.controller");
const express_1 = require("express");
const router = (0, express_1.Router)();
// register user
router.post("/register", auth_controller_1.registerUser);
// login user
router.post("/login", auth_controller_1.loginUser);
// get user profile
router.get("/profile", auth_1.authenticate, auth_controller_1.getProfile);
// logout user
router.get("/logout", auth_controller_1.logout);
// update user profile
router.put("/updateprofile", auth_1.authenticate, auth_controller_1.updateUser);
exports.default = router;
