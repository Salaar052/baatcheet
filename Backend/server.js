const express = require('express');
const authenticationRoutes = require('./Routes/authentication');
const messageRoutes = require('./Routes/message');
const mongoose = require('mongoose');
const ENV = require('./utils/ENV');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const  {  server,  app } = require('./utils/socket');

mongoose.connect(ENV.MONGO_URI).then((e) => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

const PORT = 3000;

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ limit: "10mb",extended: true }));
app.use(cors({
  origin: [ENV.Client_URL, "http://localhost:4173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());

app.use('/message',messageRoutes);
app.use('/auth', authenticationRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the BaatCheet API');
  console.log('Root route accessed');
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});