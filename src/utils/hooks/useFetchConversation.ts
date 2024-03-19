import { useEffect, useState } from "react";
import axios from "axios";

import useFetchCurrentUser from "./useFetchCurrentUser";
import { FullConversationType } from "../Types";
import useConversation from "./useConversation";

const SERVER_URL = process.env.REACT_APP_SERVER_PAGE_URL;
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

const useFetchConversation = () => {
  const id = useConversation();
  const currentUserData = useFetchCurrentUser() as User | null;
  const userEmail = currentUserData?.email;
  const [conversations, setConversations] = useState<FullConversationType[]>(
    []
  );

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get(`${SERVER_URL}/api/getconversation`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setConversations(response.data);
      } catch (error) {
        console.error("Fetch conversation Error:", error);
      }
    };

    fetchCurrentUser();
  }, [userEmail, conversations, id]);

  return conversations;
};

export default useFetchConversation;
