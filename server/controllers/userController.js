const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/users/doctors
// @access  Private
const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/users/doctors/:id
// @access  Private
const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' }).select('-password');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.json(doctor);
  } catch (error) {
    console.error('Get doctor by ID error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address, profilePicture, dateOfBirth } = req.body;
    
    // Find user by id
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (profilePicture) user.profilePicture = profilePicture;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    
    // If user is a doctor, update specialization
    if (user.role === 'doctor' && req.body.specialization) {
      user.specialization = req.body.specialization;
    }
    
    await user.save();
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      specialization: user.specialization,
      profilePicture: user.profilePicture,
      phoneNumber: user.phoneNumber,
      address: user.address,
      dateOfBirth: user.dateOfBirth
    });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDoctors, getDoctorById, updateProfile }; 