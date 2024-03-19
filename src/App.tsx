import React from "react";
import AuthHome from "./components/AuthHome/AuthHome";
import HotToast from "./utils/HotToast/HotToast";
import { Route, Routes } from "react-router-dom";
import NoRoute from "./utils/Route/NoRoute";
import { AuthProvider } from "./utils/ProtectAuth";
import UserLayout from "./components/UsersPage/List/UserLayout";
import ConversationsHome from "./components/Conversations/ConversationsHome";

const App = () => {
  
  return (
    <AuthProvider>
      <HotToast />
      <Routes>
        <Route path="/" element={<AuthHome />}/>
        <Route path="/users" element={<UserLayout />}/>
        <Route path="/conversations/:id?" element={<ConversationsHome/>}/>

        <Route path="*" element={<NoRoute/>}/>
      </Routes>
    </AuthProvider>
  );
}

export default App;
