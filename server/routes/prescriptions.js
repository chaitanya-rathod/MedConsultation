const express = require('express');
const router = express.Router();
const {
  createPrescription,
  getMyPrescriptions,
  getPrescriptionById,
  updatePrescription
} = require('../controllers/prescriptionController');
const { auth, isDoctor } = require('../middleware/auth');

// @route   POST /api/prescriptions
// @desc    Create a new prescription
// @access  Private (Doctor only)
router.post('/', auth, isDoctor, createPrescription);

// @route   GET /api/prescriptions
// @desc    Get all prescriptions for current user
// @access  Private
router.get('/', auth, getMyPrescriptions);

// @route   GET /api/prescriptions/:id
// @desc    Get prescription by ID
// @access  Private
router.get('/:id', auth, getPrescriptionById);

// @route   PUT /api/prescriptions/:id
// @desc    Update prescription
// @access  Private (Doctor only)
router.put('/:id', auth, isDoctor, updatePrescription);

module.exports = router; 