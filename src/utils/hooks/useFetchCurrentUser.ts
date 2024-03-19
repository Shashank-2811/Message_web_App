import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SERVER_URL = process.env.REACT_APP_SERVER_PAGE_URL;

const useFetchCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          const authResponse = await axios.get(`${SERVER_URL}/api/success`, {
            withCredentials: true,
          });
          const { user: newUser, token: newToken } = authResponse.data;

          setCurrentUser(newUser);
          localStorage.setItem("token", newToken);

          return;
        } else {
          const response = await axios.get(`${SERVER_URL}/api/currentuser`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        // navigate("/");
        toast.error("useFetchCurrentUser: Invalid Credentials!");
        console.error("Fetch Current User Error:", error);
      }
    };

    fetchCurrentUser();
  }, [navigate, setCurrentUser]);

  return currentUser;
};

export default useFetchCurrentUser;
