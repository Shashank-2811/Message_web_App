import { Request, Response } from "express";
import prisma from "../../db/prismadb";

const getUsers = async (req: Request, res: Response) => {
  try {
    const userEmail = req.query.userEmail as string;

    if (userEmail) {
      const users = await prisma?.user.findMany({
        where: {
          NOT: {
            email: userEmail,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      res.status(200).json({ message: "Fetch Users successful", users });
    }
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getUsers;
