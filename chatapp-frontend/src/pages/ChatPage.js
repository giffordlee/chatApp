import NavigationBar from "../components/NavigationBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import ChatList from "../components/ChatList";
import ChatContent from "../components/ChatContent";
import { Grid } from "@mui/material";
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:4000";
var socket

function ChatPage() {
  const { setUser, setSelectedChat, user } = ChatState();
  const navigate = useNavigate();
  const [fetchAgain, setFetchAgain] = useState(false)
  const [page, setPage] = useState(1);
  const [disableLoadMore, setDisableLoadMore] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit('setup', user)
    return () => {
      socket.disconnect()
    }
  },[])

  useEffect(() => {
    socket.on('new chat', () => {
      console.log("new chat")
      setFetchAgain(!fetchAgain)
    })
  })

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
          <ChatList fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} setPage={setPage} setDisableLoadMore={setDisableLoadMore}/>
        </Grid>
        <Grid item xs={9} sx={{width:'100%', height:'91.5vh'}}> 
          <ChatContent fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} page={page} setPage={setPage} disableLoadMore={disableLoadMore} setDisableLoadMore={setDisableLoadMore}/>
        </Grid>
      </Grid>
    </div>
  )
}

export default ChatPage