import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import {
  createUser,
  deleteUser,
  getAllUser,
  getUserById,
  updateUser,
} from "../controllers/userController";

const userRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";

// Middleware
const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  jwt.verify(token, JWT_SECRET, (error, decode) => {
    if (error) {
      return res.status(403).json({ message: "No tienes acceso" });
    }

    next();
  });
};

userRouter.get("/", authToken, getAllUser);
userRouter.post("/", authToken, createUser);
userRouter.get("/:id", authToken, getUserById);
userRouter.put("/:id", authToken, updateUser);
userRouter.delete("/:id", authToken, deleteUser);

export default userRouter;
