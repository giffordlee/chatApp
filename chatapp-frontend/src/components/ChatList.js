import axios from "axios";
import { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import { List, ListItem, ListItemText } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { Box, Button, Typography, Stack } from '@mui/material';
import NewGroupModal from "./NewGroupModal";

function ChatList({fetchAgain}) {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const chatss = [ 
    { id: 1, name: "Name 1", text: "Hello from Chat 1!" },
    { id: 2, name: "Name 2", text: "Hi there! This is Chat 2." },
    // Add more chat data as needed
  ];

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("http://localhost:4000/api/chat", config);
      console.log(data)
      setChats(data);
    } catch (error) {
      console.log("Error: ", error)
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")).user);
    if (user) {
      fetchChats();

    }
  }, [user, fetchAgain]);

  const getSender = (loggedUser, users) => {
    return users[0]?._id === loggedUser?._id ? users[1].username : users[0].username;
  };
  

  return (
    <Stack sx={{ height: "100%", borderRight: `1px solid grey`}}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" sx={{my:1}}>My Chat</Typography>
        <NewGroupModal>
          <Button variant="outlined" sx={{mr:1}}>New group chat</Button>
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
                      <b>{chat.latestMessage.sender.name} : </b>
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
    </Stack>

    // <Box
    //   display={{ xs: selectedChat ? 'none' : 'flex', md: 'flex' }}
    //   flexDirection="column"
    //   alignItems="center"
    //   padding={3}
    //   bgcolor="white"
    //   width={{ xs: '100%', md: '31%' }}
    //   borderRadius="lg"
    //   border="1px solid"
    // >
    //   <Box
    //     paddingBottom={3}
    //     paddingX={3}
    //     fontSize={{ xs: '28px', md: '30px' }}
    //     fontFamily="Work sans"
    //     display="flex"
    //     width="100%"
    //     justifyContent="space-between"
    //     alignItems="center"
    //   >
    //     My Chats
        
    //   </Box>
    //   <Box
    //     display="flex"
    //     flexDirection="column"
    //     padding={3}
    //     bgcolor="#F8F8F8"
    //     width="100%"
    //     height="100%"
    //     borderRadius="lg"
    //     overflowY="hidden"
    //   >
    //     {chats ? (
    //       <Stack overflowY="scroll">
    //         {chats.map((chat) => (
    //           <Box
    //             onClick={() => setSelectedChat(chat)}
    //             cursor="pointer"
    //             bgcolor={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
    //             color={selectedChat === chat ? 'white' : 'black'}
    //             paddingX={3}
    //             paddingY={2}
    //             borderRadius="lg"
    //             key={chat._id}
    //           >
                // <Typography>
                //   {!chat.isGroupChat
                //     ? getSender(loggedUser, chat.users)
                //     : chat.chatName}
                // </Typography>
                // {chat.latestMessage && (
                //   <Typography fontSize="xs">
                //     <b>{chat.latestMessage.sender.name} : </b>
                //     {chat.latestMessage.content.length > 50
                //       ? chat.latestMessage.content.substring(0, 51) + '...'
                //       : chat.latestMessage.content}
                //   </Typography>
                // )}
    //           </Box>
    //         ))}
    //       </Stack>
    //     ) : (
    //       <h2>Loading</h2>
    //     )}
    //   </Box>
    // </Box>
  );
}

export default ChatList;
