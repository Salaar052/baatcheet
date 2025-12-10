const express = require('express');
const { getAllContacts ,getChatById,sendMessage,getAllChats} = require('../Controllers/message.js');
const { verifyJwt } = require('../middlewares/authentication.js');
const Router = express.Router();

Router.use(verifyJwt);

Router.get("/contacts",getAllContacts);
Router.get("/chats",getAllChats);
Router.get("/:chatId",getChatById);
Router.post("/send/:id",sendMessage);

module.exports = Router;