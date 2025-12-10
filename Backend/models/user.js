const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true , minlength: 6},
    email: { type: String, required: true, unique: true },
    profileImage: { type: String, default: "" },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
