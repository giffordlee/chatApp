const mongoose = require("mongoose");

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
    ref: "User",
  }],
   // kiv
  latestMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  // kiv
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, { timestamps: true })


module.exports = mongoose.model("Chat", chatSchema);
