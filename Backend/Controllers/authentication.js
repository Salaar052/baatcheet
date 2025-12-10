const User = require('../models/user');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/auth');
const cloudinary = require('../utils/cloudinary');

async function signupHandler(req, res){
  const { username, password } = req.body;
  let email = req.body.email;
  email = email.toLowerCase();

  try {
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingUser =await User.findOne({ email }); 
    console.log(existingUser);
    
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    if(newUser){
      const savedUser = await newUser.save();
      const token = generateToken(savedUser._id,res);
      return res.status(201).json({_id: newUser._id, username: newUser.username, email: newUser.email,profileImage:newUser.profileImage,message:"signup", token } );
    }


}catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function loginHandler(req, res){
  const { password } = req.body; 
  let email = req.body.email;
  email = email.toLowerCase();
  
    try {   
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }   
        const token = generateToken(user._id, res);
        return res.status(200).json({ _id: user._id, username: user.username, email: user.email, profileImage: user.profileImage, message: 'Login successful' , token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

function logoutHandler(req, res) {
  res.clearCookie('jwt', { httpOnly: true, secure: false });
  return res.status(200).json({ message: 'Logged out successfully' });
} 

async function updateProfileImageHandler(req, res) {
try {
    const profileImage = req.body.profileImage;
    if (!profileImage) { 
        return res.status(400).json({ message: 'Profile image required' });

    }
    const userId = req.user._id;
    const uploadResponse = await cloudinary.uploader.upload(profileImage)
    const updatedUser = await User.findByIdAndUpdate(userId, { profileImage: uploadResponse.secure_url }, { new: true });
    return res.status(200).json({ message: 'Profile image updated successfully', updatedUser });
}
catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ message: 'Internal server error' });
}
}
module.exports = { signupHandler , loginHandler, logoutHandler, updateProfileImageHandler };