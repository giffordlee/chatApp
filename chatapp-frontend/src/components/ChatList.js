import axios from "axios";
import { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { List, ListItem, ListItemText, Button, Typography, Stack } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import NewGroupModal from "./NewGroupModal";
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
    setFetchAgain(false);
  }, [fetchAgain]);

  const getSender = (loggedUser, users) => {
    console.log(loggedUser, users)
    return users[0]?._id === loggedUser?._id ? users[1].username : users[0].username;
  };
  

  return (
    <Stack sx={{ height: "100%", borderRight: `1px solid grey`}}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{my:1}}>My Chat</Typography>
        <NewGroupModal>
          <Button variant="outlined" sx={{mr:1}}>New chat</Button>
        </NewGroupModal>
      </Stack>
      <List
        sx={{ width: "30vw", overflowY: "auto"}}
      >
        {chats && chats.map((chat) => (
          <ListItem
            key={chat._id}
            button
            selected={selectedChat && selectedChat._id === chat._id}
            onClick={() => handleChatClick(chat)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {chat.isGroupChat ? <SupervisedUserCircleIcon sx={{m: 1}}/> : <AccountCircle sx={{m: 1}}/>}
              <div>
                <ListItemText primary={!chat.isGroupChat ? getSender(loggedUser, chat.users): chat.chatName} />
                {chat.latestMessage ? (
                    <Typography variant="caption" color="grey">
                      <b>{chat.latestMessage.sender.username} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + '...'
                        : chat.latestMessage.content}
                    </Typography>
                  ) : <Typography variant="caption" color="grey">No message yet...</Typography>}
              </div>
            </div>
            <ListItemText align="right" sx={{color:'grey'}} secondary="Online"/>
          </ListItem>
        ))}
      </List>
      <SnackBar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarStatus={snackbarStatus} snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage}/>
    </Stack>
  );
}

export default ChatList;
