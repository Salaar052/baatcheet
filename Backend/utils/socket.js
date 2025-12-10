const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const socketAuthMiddleware = require("../middlewares/socketAuth");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { 
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

function getReceiverSocketId(UserId){
return socketConnections[UserId];
}

const socketConnections = {};
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}, User: ${socket.user.username}`);
  const UserId = socket.userId;

  socketConnections[UserId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(socketConnections));

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}, User: ${socket.user.username}`);
    delete socketConnections[UserId];
    io.emit("getOnlineUsers", Object.keys(socketConnections));
  });
  

});


module.exports = { app, server, io,getReceiverSocketId };