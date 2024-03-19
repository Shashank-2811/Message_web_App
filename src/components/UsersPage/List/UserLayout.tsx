import ChatBar from "../../ChatBar/ChatBar";
import Layout from "../Layout";

const UserLayout = () => {

  return (
    <div className="flex">
      <Layout/>
      <div className="hidden lg:block lg:pl-80 h-screen w-full">
        <ChatBar />
      </div>
    </div>
  );
};

export default UserLayout;  