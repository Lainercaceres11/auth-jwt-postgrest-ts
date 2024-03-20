import { Request, Response } from "express";

import prisma from "../models/user";

import { hashPassword } from "../services/password.service";

export const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "El email es obligatorio" });
  }

  if (!password) {
    return res.status(400).json({ message: "El password es obligatorio" });
  }

  try {
    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
      return res.json(401).json({ message: "El usuario no coincide" });
    }

    const user = await prisma.create({
      data: {
        email,
        password,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "No se pudo crear el usuario" });
    }

    return res.status(201).json(user);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ message: "El mail ingresado ya existe" });
    }

    console.log(error);
    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.findMany();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "No se encontro el usuario" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { email, password } = req.body;

  try {
    const updateData: any = { ...req.body };

    if (password) {
      const hashedPassword = hashPassword(password);
      updateData.password = hashedPassword;
    }

    if (email) {
      updateData.email = email;
    }

    const user = await prisma.update({
      where: { id: userId },
      data: updateData,
    });
    return res.status(200).json(user);
  } catch (error: any) {
    if (error?.code === "P2002" && error?.meta?.target?.includes("email")) {
      res.status(400).json({ message: "El mail ingresado ya existe" });
    }

    console.log(error);
    res.status(500).json({ error: "Hubo un error en el registro" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  try {
    await prisma.delete({
      where: { id: userId },
    });

    return res
      .status(200)
      .json({
        message: `El usuario ${userId} ha sido eliminado correctamente`,
      });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};
