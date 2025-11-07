const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Authorization header:', req.header('Authorization'));
    console.log('Extracted token:', token);
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    console.log('JWT_SECRET from config:', config.jwtSecret);
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('Decoded token:', decoded);
    const user = await User.findById(decoded.id).select('-password');
    console.log('User found:', user);
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.log('Token verification error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;