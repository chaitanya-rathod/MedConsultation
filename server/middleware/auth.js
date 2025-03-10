const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is a doctor
const isDoctor = (req, res, next) => {
  if (req.user && req.user.role === 'doctor') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Only doctors can perform this action' });
  }
};

// Middleware to check if user is a patient
const isPatient = (req, res, next) => {
  if (req.user && req.user.role === 'patient') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Only patients can perform this action' });
  }
};

module.exports = { auth, isDoctor, isPatient }; 