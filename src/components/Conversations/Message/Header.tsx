import React, { FC, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { useAtom } from "jotai";

import useOtherUsers from "../../../utils/hooks/useOtherUsers";
import Avatars from "../../UsersPage/Users/Avatar";
import ProfileDrawer from "./ProfileDrawer";
import AvatarsGroup from "../../GroupChat/AvatarsGroup";
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

interface Conversation {
  id: string;
  createdAt: string;
  lastMessageAt: string;
  name: string;
  isGroup: boolean;
  messages: any[];
}

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Header: FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUsers(conversation);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [globalParams, setParamsAtom] = useAtom(paramsAtom);

  const statusText = useMemo(() => {
    return conversation.isGroup
      ? `${conversation.users.length} members`
      : "Active";
  }, [conversation]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className="
          bg-white 
          w-full 
          flex 
          border-b-[1px] 
          sm:px-4 
          py-3 
          px-4 
          lg:px-6 
          justify-between 
          items-center 
          shadow-sm
        "
      >
        <div className="flex gap-3 items-center">
          <Link
            to="/conversations"
            className="
              lg:hidden 
              block 
              text-sky-500 
              hover:text-sky-600 
              transition
              cursor-pointer
            "
            onClick={() => setParamsAtom("")}
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarsGroup users={conversation.users} />
          ) : (
            <Avatars user={otherUser} />
          )}
          <div className="flex flex-col">
            <div>{conversation.name || otherUser.name}</div>
            <div className="text-sm font-light text-neutral-500">
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="
            text-sky-500
            cursor-pointer
            hover:text-sky-600
            transition
          "
        />
      </div>
    </>
  );
};

export default Header;
