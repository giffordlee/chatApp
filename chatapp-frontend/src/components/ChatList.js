import axios from "axios";
import { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { List, ListItem, ListItemText, Button, Typography, Stack, Paper} from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NewChatModal from "./NewChatModal";
import SnackBar from "../misc/SnackBar";

function ChatList({fetchAgain, setFetchAgain}) {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("");


  const handleChatClick = (chat) => {
    setSelectedChat(chat);console.log("chats",chats)
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
      console.log("Error: ", error)
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

  const getSender = (loggedUser, users) => {
    console.log(loggedUser, users)
    return users[0]?._id === loggedUser?._id ? users[1].username : users[0].username;
  };
  

  return (
    <Paper sx={{height:'100%', width:'100%'}}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{my:1}}>My Chat</Typography>
        <NewChatModal>
          <Button variant="contained" sx={{mr:1, px:1, textTransform:'none'}} endIcon={<AddCircleIcon/>}>New Chat</Button>
        </NewChatModal>
      </Stack>
      <List
        sx={{ width: "100%", overflowY: "auto"}}
      >
        {chats && chats.map((chat) => (
          <ListItem
            key={chat._id}
            button
            selected={selectedChat && selectedChat._id === chat._id}
            onClick={() => handleChatClick(chat)}
          >
            <Stack direction="row" style={{ display: 'flex', alignItems: 'center', width:"100%" }}>
              {chat.isGroupChat ? <SupervisedUserCircleIcon sx={{m: 1}}/> : <AccountCircle sx={{m: 1}}/>}
              <Stack sx={{maxWidth:'70%'}}>
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
              <ListItemText align="right" sx={{color:'grey'}} secondary="Online"/>
            </Stack>
          </ListItem>
        ))}
      </List>
      <SnackBar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarStatus={snackbarStatus} snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage}/>
    </Paper>
  );
}

export default ChatList;
