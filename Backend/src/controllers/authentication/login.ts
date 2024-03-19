import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../../db/prismadb";

const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Missing info");
    }

    const user = await prisma?.user.findUnique({
      where: {
        email: email,
      },
    });
    if(user){
      const userAccount = await prisma.account.findFirst({
        where: {
          userId: user.id
        }
      });
      if(userAccount){  
        return res.status(401).json({ error: "Invalid Credential" });
      }
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.hashedPassword !== null) {
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
    }
    user.hashedPassword = null;
    
    const payload = {
      email: email,
      id: user.id,
    };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "1d" });


    res
      .status(200)
      .json({ message: "Login successful", user, token: token });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default login;
