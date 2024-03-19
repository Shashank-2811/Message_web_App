import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "../../../@/components/ui/button";

const SERVER_URL = process.env.REACT_APP_SERVER_PAGE_URL;

export const handleLogout = async (navigate: import("react-router-dom").NavigateFunction) => {
  await localStorage.removeItem("token");
  await axios.get(`${SERVER_URL}/api/logout`, {
    withCredentials: true,
  });
  navigate("/");
  toast.success("Logged Out");
};

const SignOut = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        onClick={() => {
          handleLogout(navigate);
        }}
      >
        Sign out
      </Button>
    </div>
  );
};

export default SignOut;
