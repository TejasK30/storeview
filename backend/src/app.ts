import express from "express"
import cookieParser from "cookie-parser"
import "dotenv/config"
import cors from "cors"

import authRoutes from "./routes/auth.route"
import usersRoutes from "./routes/user.route"
import storeRoutes from "./routes/store.route"
import reviewRoutes from "./routes/review.route"
import adminRoutes from "./routes/admin.routes"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number
        email: string
        role: "system_admin" | "store_owner" | "user"
      }
    }
  }
}

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)
app.use("/api/auth", authRoutes)
app.use("/api/users", usersRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/store", storeRoutes)
app.use("/api/review", reviewRoutes)

app.get("/", (req, res) => {
  res.send("Storeview Node.js backend")
})

app.listen(process.env.PORT, () =>
  console.log(`Server is running on PORT ${process.env.PORT}`)
)
