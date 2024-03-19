import { FC, useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import { useAtom } from "jotai";
import clsx from "clsx";
import { find } from "lodash";

import useConversation from "../../../utils/hooks/useConversation";
import ConversationBox from "./ConversationBox";
import { FullConversationType } from "../../../utils/Types";
import useFetchConversation from "../../../utils/hooks/useFetchConversation";
import GroupChatModal from "../../GroupChat/GroupChatModal";
import LoadingModal from "../../Loading/LoadingModal";
import useFetchCurrentUser from "../../../utils/hooks/useFetchCurrentUser";
import pusherClient from "../../../utils/Pusher/pusher";
import { useNavigate } from "react-router-dom";
import { paramsAtom } from "../../../utils/lib/atom";

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

interface ConversationsListProps {
  initialItems: FullConversationType[];
  otherUsers: User[];
}

const ConversationsList: FC<ConversationsListProps> = ({
  initialItems,
  otherUsers,
}) => {
  const conversations = useFetchConversation();
  const currentUserData = useFetchCurrentUser() as User | null;
  const navigate = useNavigate();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { conversationId, isOpen } = useConversation();
  const [globalParams, setParamsAtom] = useAtom(paramsAtom);

  const pusherKey = useMemo(() => {
    return currentUserData?.email;
  }, [currentUserData?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }
          return currentConversation;
        })
      );
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });
      if (conversationId === conversation.id) {
        setParamsAtom("");
        navigate("/conversations");
      }
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.unbind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, conversationId, setParamsAtom, navigate]);

  useEffect(() => {
    if (conversations) {
      setItems(conversations);
      setIsLoading(false);
    }
  }, [conversations]);
  return (
    <>
      <GroupChatModal
        otherUsers={otherUsers}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <aside
        className={clsx(
          `
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
      `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="
                rounded-full 
                p-2 
                bg-gray-100 
                text-gray-600 
                cursor-pointer 
                hover:opacity-75 
                transition
              "
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {isLoading ? (
            <LoadingModal />
          ) : (
            items.map((item) => (
              <ConversationBox
                key={item.id}
                data={item}
                selected={conversationId === item.id}
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
};

export default ConversationsList;
