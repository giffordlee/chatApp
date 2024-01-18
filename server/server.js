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

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

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