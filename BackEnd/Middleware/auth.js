const Jwt = require('jsonwebtoken')
const User = require('../Models/userModel')


const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token);  
      const decoded = Jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.error('User not found for ID:', decoded.id);
        return res.status(401).json({ message: 'User not found' });
      }
      console.log('Authenticated user:', req.user);
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.error('No token provided in headers:', req.headers);
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access denied' });
  }
};

module.exports = { protect, admin };