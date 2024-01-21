import NavigationBar from "../components/NavigationBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import ChatList from "../components/ChatList";
import ChatContent from "../components/ChatContent";
import { Grid } from "@mui/material";

function ChatPage() {
  const { setUser, setSelectedChat } = ChatState();
  const navigate = useNavigate();
  const [fetchAgain, setFetchAgain] = useState(false)

  const SignOut = () => {
    localStorage.removeItem("userInfo")
    setSelectedChat(null)
    setUser(null)
    navigate("/");
    console.log("User signed out")
  }
  return (
    <div>
      <Grid container spacing={1} sx={{ display: "flex"}}>
        <Grid item xs={12} style={{marginBottom:"8px"}} p={0}>
          <NavigationBar SignOut={SignOut}/>
        </Grid>
        <Grid item xs={3} sx={{width:'100%', height:'91.5vh'}}>
          <ChatList fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        </Grid>
        <Grid item xs={9} sx={{width:'100%', height:'91.5vh'}}> 
          <ChatContent fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        </Grid>
      </Grid>
    </div>
  )
}

export default ChatPage