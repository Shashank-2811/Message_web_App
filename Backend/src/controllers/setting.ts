import { Request, Response } from "express";
import prisma from "../db/prismadb";
import { eventNames } from "process";

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

const setting = async (req: Request, res: Response) => {
  try {
    const currentUser = req.user as User;

    if (!currentUser?.id) {
      console.log("user not exist");
      return res.status(401).json("Unauthorized");
    }

    const {name, image} = req.body

    const updatedUser = await prisma.user.update({
        where:{
            id: currentUser.id
        },
        data:{
            image: image,
            name: name
        }
    })

    res.json(updatedUser)

  } catch (error) {
    console.log("setting error : ", error);
    res.status(500).json("Internal Server error");
  }
};

export default setting;
