import { List, ListItem, ListItemText } from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';

function ChatList({ selectedChat, setSelectedChat }) {
  const chats = [
    { id: 1, name: "Name 1", text: "Hello from Chat 1!" },
    { id: 2, name: "Name 2", text: "Hi there! This is Chat 2." },
    // Add more chat data as needed
  ];

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <List
      sx={{ width: "30%", borderRight: `1px solid grey`, overflowY: "auto" }}
    >
      {chats.map((chat) => (
        <ListItem
          key={chat.id}
          button
          selected={selectedChat && selectedChat.id === chat.id}
          onClick={() => handleChatClick(chat)}
        >
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<AccountCircle sx={{m: 1}}/>
						<ListItemText primary={chat.name} />
					</div>
					<ListItemText align="right" sx={{color:'grey'}} secondary="Online"/>
        </ListItem>
      ))}
    </List>
  );
}

export default ChatList;
