import { ReactNode, useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../SideBar/SideBar";
import useFetchCurrentUser from "../../utils/hooks/useFetchCurrentUser";
import UsersList from "./List/UsersList";
import LoadingModal from "../Loading/LoadingModal";

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

const Layout = ({ children }: { children?: ReactNode }) => {
  const currentUserData = useFetchCurrentUser() as User | null;
  const userEmail = currentUserData?.email;
  const [users, setUsers] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${SERVER_URL}/api/getUsers?userEmail=${userEmail}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error making API call", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  if (isLoading) {
    return <LoadingModal />;
  }
  return (
    <SideBar>
      <div>
        <UsersList items={users} />
        {children}
      </div>
    </SideBar>
  );
};

export default Layout;
