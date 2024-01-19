import NavigationBar from "../components/NavigationBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from 'axios';
import { ChatState } from "../context/ChatProvider";
import ChatList from "../components/ChatList";
import ChatContent from "../components/ChatContent";
import { Box } from "@mui/material";

function ChatPage() {
  const { user, selectedChat } = ChatState();
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false)

  
  useEffect(() => {
    if (user) {
      console.log("REACHED HERE", user)
      setUsername(user.user.username);
    } 
  }, [user])

  const SignOut = () => {
    removeCookie("token");
    localStorage.removeItem("userInfo")
    navigate("/login");
    console.log("User signed out")
  }
  return (
    <div>
      {user && <NavigationBar SignOut={SignOut} username={username}/>}
      <Box style={{ display: "flex", height: "100vh" }}>
        <ChatList fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        <ChatContent fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      </Box>
    </div>
  )
}

export default ChatPage