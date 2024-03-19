import { Request, Response } from "express";
import prisma from "../../db/prismadb";

const Users =  async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

export default Users;