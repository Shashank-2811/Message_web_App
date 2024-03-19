import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../../db/prismadb";

const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const register = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json("Missing info");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma?.user.create({
      data: {
        email,
        name,
        hashedPassword,
        emailVerified: false
      },
    });

    if (!user) {
      return res.status(500).json({ error: "Failed to create user" });
    }

    user.hashedPassword = null;
    const payload = {
      email: email,
      id: user.id,
    };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });

    user.hashedPassword = null;

    res.status(200).json({
      message: "Registration successful",
      user,
      token: token,
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default register;
