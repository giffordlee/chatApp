import axios from "axios";
import { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { List, ListItem, ListItemText, Button, Typography, Stack, Paper, Badge, Box} from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NewChatModal from "./NewChatModal";
import SnackBar from "../misc/SnackBar";
import { isUserOnline, getSenderId, getSender } from "../misc/ChatLogics";

function ChatList({fetchAgain, setPage, setDisableLoadMore}) {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats, onlineUsers } = ChatState();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("");


  const handleChatClick = (chat) => {
    setPage(1)
    setDisableLoadMore(false)
    setSelectedChat(chat);
    console.log("chats",chats)
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:4000/api/chat", config);
      setChats(data);
    } catch (error) {
      setSnackbarMessage("Error Occured! Failed to load the chats")
      setSnackbarStatus("error")
      setOpenSnackbar(true)
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // setFetchAgain(false);
  }, [fetchAgain]);  

  return (
    <Paper sx={{height:'100%', width:'100%'}}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{my:1}}>My Chat</Typography>
        <NewChatModal>
          <Button variant="contained" sx={{mr:1, px:1, textTransform:'none'}} endIcon={<AddCircleIcon/>}>New Chat</Button>
        </NewChatModal>
      </Stack>
      {chats.length !== 0 ? (
      <List
        sx={{ width: "100%", overflowY: "auto"}}
      >
        {chats.map((chat) => (
          <ListItem
            key={chat._id}
            button
            selected={selectedChat && selectedChat._id === chat._id}
            onClick={() => handleChatClick(chat)}
          >
            <Stack direction="row" style={{ display: 'flex', alignItems: 'center', width:"100%" }}>
              {chat.isGroupChat ? 
                <SupervisedUserCircleIcon/> : 
                (isUserOnline(getSenderId(loggedUser, chat.users), onlineUsers) ? (
                <Badge color="success"  badgeContent=" " variant="dot" overlap="circular">
                  <AccountCircle/>
                </Badge>
                ) : (
                  <Badge color="error"  badgeContent=" " variant="dot" overlap="circular">
                    <AccountCircle/>
                  </Badge>
                ))
              }
              <Stack sx={{maxWidth:'70%'}} ml={1}>
                <ListItemText primary={!chat.isGroupChat ? getSender(loggedUser, chat.users): chat.chatName} />
                {chat.latestMessage ? (
                    <Typography variant="caption" color="grey" sx={{overflow:'hidden', whiteSpace:'nowrap',textOverflow:'ellipsis'}}>
                      <b>{chat.latestMessage.sender.username} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + '...'
                        : chat.latestMessage.content}
                    </Typography>
                  ) : <Typography variant="caption" color="grey">No message yet...</Typography>}
              </Stack>
              {!chat.isGroupChat && 
                <ListItemText 
                  align="right" 
                  disableTypography
                  primary={
                    <Typography variant="caption" sx={{color: isUserOnline(getSenderId(loggedUser, chat.users), onlineUsers) ? '#2e7d32' : '#d32f2f'}}>
                      {isUserOnline(getSenderId(loggedUser, chat.users), onlineUsers) ? 'Online' : 'Offline'}
                    </Typography>
                  }
                />
              }
            </Stack>
          </ListItem>
        ))}
      </List>
      ) : (
        <Box sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <Typography variant="h6">No chat found...</Typography>
        </Box>
      )}
      <SnackBar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarStatus={snackbarStatus} snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage}/>
    </Paper>
  );
}

export default ChatList;
