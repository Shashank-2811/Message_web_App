import { Request, Response } from "express";

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

const getCurrentUser = (req: Request, res: Response) => {
  try {
    const userData = req.user as User;

    res.json({ message: "Access granted", user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getCurrentUser;
