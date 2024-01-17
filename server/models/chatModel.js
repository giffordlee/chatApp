const mongoose = require("mongoose");
const userModel = require("./userModel");

const chatSchema = new mongoose.Schema({
  chatName: {
    type: String,
    trim: true,
  },
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
  }],
   // kiv
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "messagemodel",
  },
  // kiv
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
  }
}, { timestamps: true })


module.exports = mongoose.model("Chat", chatSchema);
