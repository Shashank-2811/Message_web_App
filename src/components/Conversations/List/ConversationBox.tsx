import { FC } from "react";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";

import useFetchCurrentUser from "../../../utils/hooks/useFetchCurrentUser";
import useOtherUsers from "../../../utils/hooks/useOtherUsers";
import { FullConversationType } from "../../../utils/Types";
import Avatars from "../../UsersPage/Users/Avatar";
import AvatarsGroup from "../../GroupChat/AvatarsGroup";
import { paramsAtom } from "../../../utils/lib/atom";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

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

const ConversationBox: FC<ConversationBoxProps> = ({ data, selected }) => {
  const currentUserData = useFetchCurrentUser() as User | null;
  const otherUser = useOtherUsers(data);
  const navigate = useNavigate();

  const [globalParams, setParamsAtom] = useAtom(paramsAtom);

  const handleClick = useCallback(() => {
    setParamsAtom(data.id);
    navigate(`/conversations/${data.id}`);
  }, [navigate, data.id]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];
    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return currentUserData?.email;
  }, [currentUserData?.email]);

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return (
      seenArray.filter((user: { email: string }) => user.email === userEmail)
        .length !== 0
    );
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "sent an image";
    }
    if (lastMessage?.body) {
      return lastMessage.body;
    }
    return "Start a Conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        `,
        selected ? "bg-neutral-100" : "bg-gray-300"
      )}
    >
      {data.isGroup ? (
        <AvatarsGroup users={data.users} />
      ) : (
        <Avatars user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs 
                  text-gray-700 
                  font-light
                "
              >
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate 
              text-sm
              `,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
