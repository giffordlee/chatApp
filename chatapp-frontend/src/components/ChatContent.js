import { useState, useEffect } from 'react';
import { Paper, Typography, Grid, ListItem, ListItemText, Fab, List, Divider, TextField, Stack, CircularProgress, Box} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { ChatState } from '../context/ChatProvider';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import axios from 'axios';
import io from 'socket.io-client';
import SnackBar from '../misc/SnackBar';
import ScrollableChat from './ScrollableChat';

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

function ChatContent({ fetchAgain, setFetchAgain}) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [loggedUser, setLoggedUser] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarStatus, setSnackbarStatus] = useState("");

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `http://localhost:4000/api/message/${selectedChat._id}`,
        config
      );
      
      const updatedMessages = data.map(message => {
        const isCurrentUser = message.sender._id === user._id;
        message.align = isCurrentUser ? 'right' : 'left';

        const timestamp = new Date(message.createdAt);
        const options = {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true, // Use 12-hour time format
          timeZone: 'Asia/Singapore', // Specify the time zone
        };
        const singaporeTimeString = timestamp.toLocaleString('en-SG', options);
        message.createdAt = singaporeTimeString
        return message;
      });
      console.log("fetch messages",updatedMessages)
      setMessages(updatedMessages);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit('setup', user)
    socket.on("connected", () => {setSocketConnected(true)})

    return () => {
      socket.disconnect()
    }
  }, [])


  useEffect(() => {
    fetchMessages()
    selectedChatCompare = selectedChat;
    
  }, [selectedChat])

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  },[selectedChat])

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {
      setFetchAgain(!fetchAgain)

      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // notify
      } else {
        const timestamp = new Date(newMessageReceived.updatedAt);
        const options = {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true, // Use 12-hour time format
          timeZone: 'Asia/Singapore', // Specify the time zone
        };
        const singaporeTimeString = timestamp.toLocaleString('en-SG', options);
        newMessageReceived.createdAt = singaporeTimeString
        setMessages([...messages, newMessageReceived])
      }
    })
  })

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage) {
      // socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:4000/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
        fetchMessages()
        setFetchAgain(!fetchAgain)
      } catch (error) {
        console.log("error")
        setSnackbarMessage("Error Occured!")
        setSnackbarStatus("error")
        setOpenSnackbar(true)
      }
      
    }
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
  }

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].username : users[0].username;
  };

  return (
    <Paper sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
      {loading ? (
        <CircularProgress/>
      ) : (
        selectedChat ? (
          <Box sx={{width:"100%", height:'100%', display:"flex", flexDirection:'column', justifyContent:'space-between'}}>
            <Box>
              <Stack direction='row'>
                {selectedChat.isGroupChat ? <SupervisedUserCircleIcon sx={{m: 1}}/> : <AccountCircle sx={{m: 1}}/>}
                <Typography variant='h5' sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>{!selectedChat.isGroupChat ? getSender(loggedUser, selectedChat.users): selectedChat.chatName}</Typography>
              </Stack>
              <Divider />
            </Box>
            {/* <List sx={{ height: '70vh', overflowY: 'auto' }}>
              {messages.map((message, index) => (
                <ListItem key={index}>
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText align={message.align} primary={message.content}></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                    <ListItemText
                      align={message.align}
                      secondary={
                        <span style={{ fontSize: '10px' }}>
                          <strong style={{ fontWeight: 'bold' }}>{message.sender.username}</strong> {message.createdAt}
                        </span>
                      }
                    ></ListItemText>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List> */}
            <Box sx={{display:'flex', flexDirection:'column', justifyContent:'flex-end', height:'100%', overflowY:'hidden'}}>
              <Box sx={{display:'flex', flexDirection:'column', overflowY:'scroll', msOverflowStyle: 'none', scrollbarWidth: 'none',  '&::-webkit-scrollbar': {display: 'none'}}} mb='2px'>
                <ScrollableChat messages={messages}/>

              </Box>
            
              <Divider />
              <form noValidate>
                <Grid container style={{ padding: '20px' }}>
                  <Grid item xs={11}>
                    <TextField 
                      label="Enter a message..." 
                      fullWidth 
                      value={newMessage}
                      onChange={handleTyping}
                    />
                  </Grid>
                  <Grid item xs={1} align="right">
                    <Fab color="primary" aria-label="add" type="submit" onClick={handleSendMessage}><SendIcon/></Fab>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        ) : (
          <Typography variant="h6">Select a chat to view messages</Typography>
        )
      )}
      <SnackBar openSnackbar={openSnackbar} setOpenSnackbar={setOpenSnackbar} snackbarStatus={snackbarStatus} snackbarMessage={snackbarMessage} setSnackbarMessage={setSnackbarMessage}/>
    </Paper>
    
  );
}

export default ChatContent;
