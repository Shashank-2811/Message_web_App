import { useState } from "react";

import useRoutes from "../../../utils/hooks/useRoutes";
import DesktopItem from "./DesktopItem";
import Avatars from "../../UsersPage/Users/Avatar";
import useFetchCurrentUser from "../../../utils/hooks/useFetchCurrentUser";
import SettignsModal from "../../UsersPage/Users/SettignsModal";

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

const DesktopSidebar = () => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = useFetchCurrentUser() as unknown as User;

  return (
    <>
      <SettignsModal
      currentUser={currentUser}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      />
      <div>
        <div
          className="
        hidden 
        lg:fixed 
        lg:inset-y-0 
        lg:left-0 
        lg:z-40 
        lg:w-20 
        xl:px-6
        lg:overflow-y-auto 
        lg:bg-white 
        lg:border-r-[1px]
        lg:pb-4
        lg:flex
        lg:flex-col
        justify-between
    "
        >
          <nav className="mt-4 flex flex-col justify-between">
            <ul className="flex flex-col items-center space-y-1">
              {routes.map((item) => (
                <DesktopItem
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={item.active}
                  onClick={item.onClick}
                />
              ))}
            </ul>
          </nav>
          <nav className="mt-4 flex flex-col justify-between items-center">
            <div
              onClick={() => setIsOpen(true)}
              className="cursor-pointer hover:opacity-75 transition"
            >
              <Avatars user={currentUser} />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default DesktopSidebar;
