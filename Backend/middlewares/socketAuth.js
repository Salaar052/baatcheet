const jwt = require('jsonwebtoken');
const ENV = require('../utils/ENV');
const User = require('../models/user');

const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie
            ?.split('; ')
            .find(row => row.startsWith('jwt='))
            ?.split('=')[1];

        if (!token) {
            console.log('No token provided in cookies');
            return next(new Error('unauthorized error: No token provided'));
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
         if (!user) {
            console.log('User not found for the provided token');
            return next(new Error('unauthorized error: User not found'));
        }
        socket.user = user;
        socket.userId = user._id.toString();
        console.log(`Socket authenticated for user: ${user.username}`);
        next(); 

    } catch (error) {
        console.error('Error extracting token from cookies', error);
        return next(new Error('unauthorized error: Invalid token format'));
    }
};

module.exports = socketAuthMiddleware;