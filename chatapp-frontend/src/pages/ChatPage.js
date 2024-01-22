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
  const { setUser, setSelectedChat, user, chats, setChats } = ChatState();
  const navigate = useNavigate();
  const [fetchAgain, setFetchAgain] = useState(false)
  const [page, setPage] = useState(1);
  const [disableLoadMore, setDisableLoadMore] = useState(true);
  const [messages, setMessages] = useState([])

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

  useEffect(() => {
    socket.on('new username', (data) => {
      const { oldUsername, newUsername } = data;
      console.log(oldUsername,newUsername)
      setChats(chats.map((c) => {
        if (c.latestMessage && c.latestMessage.sender.username === oldUsername) {
          c.latestMessage.sender.username = newUsername
        }
        c.users= c.users.map((u) => {
            if (u.username === oldUsername) {
              u.username = newUsername;
            }
            return u;
          })
          
        return c
      }))

      setMessages(messages.map((m) => {
        if (m.sender.username === oldUsername) {
          m.sender.username = newUsername
        }
        return m;
      }))
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
          <ChatList fetchAgain={fetchAgain} setPage={setPage} setDisableLoadMore={setDisableLoadMore}/>
        </Grid>
        <Grid item xs={9} sx={{width:'100%', height:'91.5vh'}}> 
          <ChatContent 
            fetchAgain={fetchAgain} 
            setFetchAgain={setFetchAgain} 
            page={page} 
            setPage={setPage} 
            disableLoadMore={disableLoadMore} 
            setDisableLoadMore={setDisableLoadMore} 
            messages={messages} 
            setMessages={setMessages}/>
        </Grid>
      </Grid>
    </div>
  )
}

export default ChatPage