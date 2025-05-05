const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log

    const user = await User.findOne({ _id: decoded.user.id });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    req.user = user;
    req.token = token; // Attach token to request
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ 
      msg: 'Please authenticate',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};