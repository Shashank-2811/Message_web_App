import { Request, Response } from "express";
import prisma from "../db/prismadb";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  conversationIds: [];
  seenMessageIds: [];
}

const getMessage = async (req: Request, res: Response) => {

  try {
    const currentUser = req.user as User;

    if (!currentUser.email) {
      console.log("user not found");
      return res.json([]);
    }

    const { conversationId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    
    return res.json(messages);
  } catch (error) {
    console.log("getMessage", error);
  }
};

export default getMessage;
