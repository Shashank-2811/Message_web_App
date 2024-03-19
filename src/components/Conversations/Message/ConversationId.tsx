import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "./Header";
import ChatBody from "./ChatBody";
import Form from "./Form";
import useFetchCurrentUser from "../../../utils/hooks/useFetchCurrentUser";
import LoadingModal from "../../Loading/LoadingModal";

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

interface Conversation {
  id: string;
  createdAt: string;
  lastMessageAt: string;
  name: string;
  isGroup: boolean;
  messages: any[];
}

const ConversationId = ({ children }: { children?: React.ReactNode }) => {
  const { id } = useParams<{ id: string }>();
  const [conversation, setConversation] = useState<
    Conversation & { users: User[] }
  >({
    id: "",
    createdAt: "",
    lastMessageAt: "",
    name: "",
    isGroup: false,
    messages: [],
    users: [],
  });
  const [message, setMessage] = useState<any[]>([]);
  const currentUserData = useFetchCurrentUser() as User | null;
  const userEmail = currentUserData?.email;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token not found");

        const conversationResponse = await axios.get(
          `${SERVER_URL}/api/getconversationsbyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setConversation(conversationResponse.data);
        const messageResponse = await axios.get(
          `${SERVER_URL}/api/getmessage/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage(messageResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, userEmail]);

  return (
    <>
      {isLoading ? (
        <LoadingModal />
      ) : (
        <div className="lg:pl-96 h-screen">
          <div className="h-screen flex flex-col">
            <Header conversation={conversation} />
            <ChatBody initialMessages={message} />
            <Form />
          </div>
        </div>
      )}
    </>
  );
};

export default ConversationId;
