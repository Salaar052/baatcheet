const { text } = require('express');
const mongoose = require('mongoose');
const { image } = require('../utils/cloudinary');
const { Schema } = mongoose;
const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String,  },
  image: { type: String },
},{timestamps: true});

const Message = mongoose.model('message',messageSchema);
module.exports = Message;