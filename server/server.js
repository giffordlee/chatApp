const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db")
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute")
const chatRoute = require("./routes/chatRoute")
const messageRoute = require("./routes/messageRoute")
require("dotenv").config();

const app = express();
const { MONGO_URL, PORT } = process.env;

connectDB()

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000'
  }
})

io.on("connection", (socket) => {
  console.log("connected to socket.io")

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(userData._id)
    socket.emit('connected')
  })

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log("User joined room: " + room)
  })

  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users not defined')

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;
      
      socket.in(user._id).emit("message received", newMessageReceived)
    })
  })
})

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/api/user", authRoute)
app.use("/api/chat", chatRoute)
app.use("/api/message", messageRoute)