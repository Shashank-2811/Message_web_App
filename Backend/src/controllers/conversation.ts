import { Request, Response } from "express";
import prisma from "../db/prismadb";
import { pusherServer } from "../middlewares/pusher";

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

const conversations = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user as User;

    const body = await req.body;

    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      console.log("conversation.ts: unauthorized");
      return res.status(402).json({ message: "unauthorized" });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      console.log("conversation.ts: Invalid Data");
      return res.status(401).json({ message: "Invalid Data" });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      newConversation.users.forEach((user)=>{
        if(user.email){
          pusherServer.trigger(user.email, 'conversation:new', newConversation)
        }
      })

      return res.status(200).json(newConversation);
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversations = existingConversations[0];

    if (singleConversations) {
      return res.json(singleConversations);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    newConversation.users.forEach((user)=>{
      if(user.email){
        pusherServer.trigger(user.email, 'conversation:new', newConversation)
      }
    })
    
    return res.json(newConversation);
  } catch (error) {
    console.log("conversation.ts: ", error);
    return res.status(500).json({ message: "Internal Error" });
  }
};

export default conversations;
