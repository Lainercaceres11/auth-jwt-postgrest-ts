import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../services/password.service";

import prisma from "../models/user";
import { generateToken } from "../services/auth-token.service";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "El email es obligatorio" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "El password es obligatorio" });
      return;
    }
    const hashedPassword = await hashPassword(password);

    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ message: "El mail ingresado ya existe" });
    }

    console.log(error);
    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email) {
      res.status(400).json({ message: "El email es obligatorio" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "El password es obligatorio" });
      return;
    }

    const user = await prisma.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const passwordMath = await comparePassword(password, user.password);

    if (!passwordMath) {
      return res
        .status(401)
        .json({ message: "Usuario y contraseña no coinciden" });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
  }
};
