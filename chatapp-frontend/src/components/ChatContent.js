import { useState, useEffect } from 'react';
import { Paper, Typography, Grid, ListItem, ListItemText, Fab, List, Divider, TextField, Stack, CircularProgress} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { ChatState } from '../context/ChatProvider';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import axios from 'axios';
import io from 'socket.io-client';

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

function ChatContent({ messagess, fetchAgain, setFetchAgain}) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketeConnected, setSocketConnected] = useState(false);

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
        const isCurrentUser = message.sender._id === user.user._id;
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
      console.log("HERE",updatedMessages)
      setMessages(updatedMessages);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    
    if (user) {
      console.log("im right here")
      socket.emit('setup', user.user)
      socket.on("connection", () => {setSocketConnected(true)})
    }
  }, [user])


  useEffect(() => {
    if (user) {
      fetchMessages()
      selectedChatCompare = selectedChat;
    }
  }, [user, selectedChat])

  useEffect(() => {
    socket.on('message received', (newMessageReceived) => {

      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        // notify
      } else {
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
        console.log(":",data)
        socket.emit("new message", data);
        setMessages([...messages, data]);
        fetchMessages()
      } catch (error) {
        console.log("error")
      }
    }
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
  }

  return (
    <Paper sx={{ flex: 1, pl: 2 }}>
      {loading ? (
        <CircularProgress/>
      ) : (
        selectedChat ? (
          <Grid>
            <Stack direction='row'>
              {selectedChat.isGroupChat ? <SupervisedUserCircleIcon sx={{m: 1}}/> : <AccountCircle sx={{m: 1}}/>}
              <Typography variant='h5' sx={{display:'flex', justifyContent:'center', alignItems:'center'}}>{selectedChat.chatName}</Typography>
            </Stack>
            <Divider />
            <List sx={{ height: '70vh', overflowY: 'auto' }}>
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
            </List>
            <Divider />
            <form noValidate>
              <Grid container style={{ padding: '20px' }}>
                <Grid item xs={11}>
                  <TextField 
                    id="outlined-basic-email" 
                    label="Enter a message..." 
                    fullWidth 
                    value={newMessage}
                    onChange={handleTyping}
                  />
                </Grid>
                <Grid item xs={1} align="right">
                  <Fab color="primary" aria-label="add" type="submit" onClick={handleSendMessage}><SendIcon /></Fab>
                </Grid>
              </Grid>
              </form>
          </Grid>
        ) : (
          <Typography variant="h6">Select a chat to view messages</Typography>
        )
      )}
    </Paper>
    
  );
}

export default ChatContent;
