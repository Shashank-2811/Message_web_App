import { useMemo } from "react";

import useFetchCurrentUser from "./useFetchCurrentUser";
import { FullConversationType } from "../Types";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
  conversationIds: string[];
  seenMessageIds: string[];
}

const useOtherUsers = (
  conversation: FullConversationType | { user: User[] }
) => {
  const currentUserData = useFetchCurrentUser() as User | null;

  const otherUser = useMemo(() => {
    const currentUserEmail = currentUserData?.email;

    if ("user" in conversation) {
      const otherUsers = (conversation as { user: User[] }).user.filter(
        (u) => u.email !== currentUserEmail
      );
      return otherUsers[0];
    } else {
      const otherUsers = (conversation as FullConversationType).users.filter(
        (u) => u.email !== currentUserEmail
      );
      return otherUsers[0];
    }
  }, [currentUserData, conversation]);

  return otherUser;
};

export default useOtherUsers;
