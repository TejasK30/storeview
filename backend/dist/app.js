"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const store_route_1 = __importDefault(require("./routes/store.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use("/api/auth", auth_route_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/store", store_route_1.default);
app.get("/", (req, res) => {
    res.send("Storeview Node.js Backend is running with Prisma ORM.");
});
app.listen(process.env.PORT, () => console.log(`Server is running on PORT ${process.env.PORT}`));
