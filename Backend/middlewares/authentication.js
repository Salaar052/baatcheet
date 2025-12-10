const ENV = require('../utils/ENV');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
async function verifyJwt(req, res, next) {
    
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized No token'  });
    }   
    try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ message: 'Unauthorized Invalid token' });
        }
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized User not found' });
        }   
        req.user = user;
        next();
    } catch (error) {
       console.error('Error verifying token:', error);
       return res.status(500).json({ message: 'Unauthorized Invalid token' });
    }   

}
module.exports = { verifyJwt };