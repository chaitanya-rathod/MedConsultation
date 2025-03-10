const express = require('express');
const router = express.Router();
const {
  createConsultation,
  getMyConsultations,
  getConsultationById,
  updateConsultationStatus,
  addMessage
} = require('../controllers/consultationController');
const { auth, isPatient } = require('../middleware/auth');

// @route   POST /api/consultations
// @desc    Create a new consultation
// @access  Private (Patient only)
router.post('/', auth, isPatient, createConsultation);

// @route   GET /api/consultations
// @desc    Get all consultations for current user
// @access  Private
router.get('/', auth, getMyConsultations);

// @route   GET /api/consultations/:id
// @desc    Get consultation by ID
// @access  Private
router.get('/:id', auth, getConsultationById);

// @route   PUT /api/consultations/:id/status
// @desc    Update consultation status
// @access  Private
router.put('/:id/status', auth, updateConsultationStatus);

// @route   POST /api/consultations/:id/messages
// @desc    Add message to consultation
// @access  Private
router.post('/:id/messages', auth, addMessage);

module.exports = router; 