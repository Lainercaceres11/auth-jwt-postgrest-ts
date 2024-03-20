import { Router } from "express";
import { login, registerUser } from "../controllers/authController";

const authRouter = Router()

authRouter.post("/register", registerUser)
authRouter.post("/login", login)

export default authRouter