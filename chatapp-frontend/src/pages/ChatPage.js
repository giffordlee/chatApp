import NavigationBar from "../components/NavigationBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import ChatList from "../components/ChatList";
import ChatContent from "../components/ChatContent";
import { Box } from "@mui/material";

function ChatPage() {
  const { user } = ChatState();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [fetchAgain, setFetchAgain] = useState(false)

  
  useEffect(() => {
    if (user) {
      console.log("REACHED HERE", user)
      setUsername(user.username);
    } 
  }, [user])

  const SignOut = () => {
    localStorage.removeItem("userInfo")
    navigate("/");
    console.log("User signed out")
  }
  return (
    <div>
      <NavigationBar SignOut={SignOut} username={username}/>
      <Box style={{ display: "flex", height: "100vh" }}>
        <ChatList fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        <ChatContent fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
      </Box>
    </div>
  )
}

export default ChatPage