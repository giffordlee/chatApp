const mongoose = require("mongoose")
const userModel = require("./userModel")
const chatModel = require("./chatModel")

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel
  },
  content: {
    type: String,
    trim: true,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: chatModel
  }

}, {timestamps: true})

module.exports = mongoose.model("Message", messageSchema)