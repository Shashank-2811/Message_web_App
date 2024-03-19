import React, { useEffect, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAtom } from "jotai";

import SideBar from "../../SideBar/SideBar";
import ChatBar from "../../ChatBar/ChatBar";
import ConversationsList from "./ConversationsList";
import useFetchConversation from "../../../utils/hooks/useFetchConversation";
import useFetchCurrentUser from "../../../utils/hooks/useFetchCurrentUser";
import LoadingModal from "../../Loading/LoadingModal";
import { paramsAtom } from "../../../utils/lib/atom";
import ConversationId from "../Message/ConversationId";

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

const ConversationsLayout = ({ children }: { children?: React.ReactNode }) => {
  const conversation = useFetchConversation();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const currentUserData = useFetchCurrentUser() as User | null;
  const [otherUsers, setOtherUsers] = useState<User[]>([]);
  const userEmail = currentUserData?.email;
  const [isLoading, setIsLoading] = useState(true);
  const [globalParams, setParamsAtom] = useAtom(paramsAtom);

  useEffect(() => {
    if (!globalParams && params.id) {
      setParamsAtom(params.id);
    }
    if (!globalParams && !params.id) {
      setParamsAtom("");
      navigate("/conversations");
    }
  }, [globalParams, params.id, setParamsAtom, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${SERVER_URL}/api/getUsers?userEmail=${userEmail}`
        );
        setOtherUsers(response.data.users);
      } catch (error) {
        console.error("Error making API call", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  return (
    <>
      {globalParams ? (
        <>
          <div className="hidden lg:block">
            <SideBar>
              <div>
                <ConversationsList
                  otherUsers={otherUsers}
                  initialItems={conversation}
                />
                {children}
              </div>
            </SideBar>
          </div>
          <ConversationId />
        </>
      ) : (
        <>
          <SideBar>
            <div>
              <ConversationsList
                otherUsers={otherUsers}
                initialItems={conversation}
              />
              {children}
            </div>
          </SideBar>
          <div className="hidden lg:block lg:pl-80 h-screen w-full">
            <ChatBar />
          </div>
        </>
      )}
    </>
  );
};

export default ConversationsLayout;
