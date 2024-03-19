import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiChat } from "react-icons/hi";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";

import { handleLogout } from "../../components/AuthHome/SignOut/SignOut";

const useRoutes = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const routes = useMemo(
    () => [
      {
        label: "chat",
        href: "/conversations",
        icon: HiChat,
        active: pathname.startsWith("/conversations"),
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        active: pathname === "/users",
      },
      {
        label: "Logout",
        href: "#",
        onClick: () => handleLogout(navigate),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, navigate]
  );

  return routes;
};

export default useRoutes;
