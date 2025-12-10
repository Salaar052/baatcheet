const express = require('express');
const { signupHandler,loginHandler,logoutHandler ,updateProfileImageHandler} = require('../Controllers/authentication');
const {verifyJwt} = require('../middlewares/authentication');
const {arcjetProtection} = require('../middlewares/arcjet');

const router = express.Router();

router.get('/login', (req, res) => {
  res.send('Login route');
});

router.post('/signup', signupHandler);
router.post('/login',loginHandler);
router.post('/logout', logoutHandler);
router.put('/updateProfileImage',verifyJwt, updateProfileImageHandler);

router.get('/check', verifyJwt, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;