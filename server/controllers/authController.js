const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, phoneNumber, address, dateOfBirth } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      specialization: role === 'doctor' ? specialization : undefined,
      phoneNumber,
      address,
      dateOfBirth
    });
    
    await user.save();
    
    // Return user data with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization,
      profilePicture: user.profilePicture,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if password matches
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Return user data with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization,
      profilePicture: user.profilePicture,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get me error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getMe }; 