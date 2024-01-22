import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';

const ChatContext = createContext();

var socket
const ENDPOINT = "http://localhost:4000";

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  // const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([])
  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on('online', (res) => {
      console.log('online users', res)
      setOnlineUsers(res)
    })
  }, [])


  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    
    if (!userInfo && window.location.pathname !=='/signup') navigate("/");
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        // notification,
        // setNotification,
        chats,
        setChats,
        onlineUsers
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;