import React, { useState } from "react";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";

function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const messages = [
    { text: "Hey man, What's up ?", align: "right", timestamp: "09:30" },
    { text: "Hey, I am Good! What about you ?", align: "left", timestamp: "09:31" },
    { text: "Cool. I am good, let's catch up!", align: "right", timestamp: "10:30" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatList selectedChat={selectedChat} setSelectedChat={setSelectedChat} />

      <ChatContent selectedChat={selectedChat} messages={messages}/>
    </div>
  );
}

export default ChatPage;
