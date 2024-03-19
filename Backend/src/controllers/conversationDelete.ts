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

const conversationDelete = async(req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const currentUser = req.user as User;

    if (!currentUser?.id) {
      console.log("user not exist");
      return res.status(401).json("Unauthorized");
    }

    const existingConversation = await prisma.conversation.findUnique({
        where:{
            id: conversationId
        },
        include:{
            users: true
        }
    })

    if(!existingConversation){
        res.status(400).json("Invalid ID")
    }

    const deltedConversation = await prisma.conversation.deleteMany({
        where:{
            id: conversationId,
            userIds: {
                hasSome: [currentUser.id]
            }
        }
    })

    existingConversation?.users.forEach((user)=>{
      if(user.email){
        pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
      }
    })

    res.json(deltedConversation);
  } catch (error) {
    console.log("conversationDelete: ", error);
    res.status(500).json("Internal Server error");
  }
};

export default conversationDelete;