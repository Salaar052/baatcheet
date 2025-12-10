
const jwt = require("jsonwebtoken");
const ENV = require("./ENV");

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
  });
  return token;
};

module.exports = { generateToken };