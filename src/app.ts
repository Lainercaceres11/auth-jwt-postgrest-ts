import express from "express"
import dotenv from "dotenv"

import authRouter from "./routes/AuthRouter"
import userRouter from "./routes/UserRouter"

dotenv.config()

const app = express()

app.use(express.json())

// Routes
app.use("/auth", authRouter)
app.use("/users", userRouter)

export default app