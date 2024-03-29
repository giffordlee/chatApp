const User = require("../models/userModel");
const Message = require("../models/messageModel")
const Chat = require("../models/chatModel")

module.exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "username");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "username",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}

module.exports.allMessages = async (req, res) => {
  const page = parseInt(req.params.page);
  const pageSize = 5;
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username")
      .populate("chat")
      .sort({createdAt:-1})
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      
    res.json(messages.reverse());
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}