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

const getConversationById = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user as User;

    if (!currentUser.email) {
      return res.json([]);
    }
    const { conversationId } = req.params;
    if (conversationId) {
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId as string,
        },
        include: {
          users: true,
        },
      });

      return res.json(conversation);
    }
  } catch (error) {
    console.log("getConversationById", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getConversationById;
