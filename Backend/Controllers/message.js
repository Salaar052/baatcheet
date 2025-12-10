const Message = require("../models/message.js");
const User = require("../models/user.js");
const cloudinary = require("../utils/cloudinary.js");
const { io,getReceiverSocketId } = require("../utils/socket.js");

const getAllContacts = async (req, res) => {
  try {
    const currentUserId = req.user.id; // Assuming req.user is populated by authentication middleware
    const remainingUsers = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password ");
    res.status(200).json(remainingUsers);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getChatById = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: no user in request" });
    }

    const myId = req.user._id.toString();  // FIXED
    const { chatId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: chatId },
        { sender: chatId, receiver: myId },
      ],
    }).sort({ createdAt: 1 });

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found for this chat" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { id: receiverId } = req.params;
    const { text, image } = req.body;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
      image: imageUrl || "",
    });

    //todo: emit socket event to receiver for real time message
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage);
  }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllChats = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const chats = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    }).sort({ createdAt: -1 }); // Sort by latest message first

    const chatPartnersIds = [
      ...new Set(
        chats.map((chat) =>
          chat.sender.toString() === currentUserId
            ? chat.receiver.toString()
            : chat.sender.toString()
        )
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnersIds },
    }).select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { getAllContacts, getChatById, sendMessage, getAllChats };
