const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, updateProfile } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// @route   GET /api/users/doctors
// @desc    Get all doctors
// @access  Private
router.get('/doctors', auth, getDoctors);

// @route   GET /api/users/doctors/:id
// @desc    Get doctor by ID
// @access  Private
router.get('/doctors/:id', auth, getDoctorById);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

module.exports = router; 