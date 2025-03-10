const Consultation = require('../models/Consultation');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

// @desc    Create a new consultation
// @route   POST /api/consultations
// @access  Private (Patient only)
const createConsultation = async (req, res) => {
  try {
    const { doctorId, scheduledDate, duration, reason } = req.body;
    
    // Check if doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    // Create a unique room ID
    const roomId = uuidv4();
    
    // Create new consultation
    const consultation = new Consultation({
      patient: req.user._id,
      doctor: doctorId,
      scheduledDate,
      duration,
      reason,
      roomId
    });
    
    await consultation.save();
    
    // Populate patient and doctor information
    await consultation.populate('patient doctor', 'name email profilePicture specialization');
    
    res.status(201).json(consultation);
  } catch (error) {
    console.error('Create consultation error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all consultations for current user (doctor or patient)
// @route   GET /api/consultations
// @access  Private
const getMyConsultations = async (req, res) => {
  try {
    let consultations;
    
    if (req.user.role === 'doctor') {
      consultations = await Consultation.find({ doctor: req.user._id })
        .populate('patient', 'name email profilePicture')
        .sort({ scheduledDate: -1 });
    } else {
      consultations = await Consultation.find({ patient: req.user._id })
        .populate('doctor', 'name email profilePicture specialization')
        .sort({ scheduledDate: -1 });
    }
    
    res.json(consultations);
  } catch (error) {
    console.error('Get consultations error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get consultation by ID
// @route   GET /api/consultations/:id
// @access  Private
const getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('patient', 'name email profilePicture')
      .populate('doctor', 'name email profilePicture specialization');
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    // Check if user is authorized to view this consultation
    if (
      consultation.patient._id.toString() !== req.user._id.toString() &&
      consultation.doctor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this consultation' });
    }
    
    res.json(consultation);
  } catch (error) {
    console.error('Get consultation by ID error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update consultation status
// @route   PUT /api/consultations/:id/status
// @access  Private
const updateConsultationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    // Check if user is authorized to update this consultation
    if (
      consultation.patient.toString() !== req.user._id.toString() &&
      consultation.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this consultation' });
    }
    
    consultation.status = status;
    
    if (status === 'completed') {
      consultation.completedAt = Date.now();
    }
    
    await consultation.save();
    
    res.json(consultation);
  } catch (error) {
    console.error('Update consultation status error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add message to consultation
// @route   POST /api/consultations/:id/messages
// @access  Private
const addMessage = async (req, res) => {
  try {
    const { content } = req.body;
    
    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    // Check if user is authorized to add message to this consultation
    if (
      consultation.patient.toString() !== req.user._id.toString() &&
      consultation.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to add message to this consultation' });
    }
    
    const message = {
      sender: req.user._id,
      content
    };
    
    consultation.messages.push(message);
    await consultation.save();
    
    // Populate sender information
    await consultation.populate('messages.sender', 'name role');
    
    res.json(consultation.messages[consultation.messages.length - 1]);
  } catch (error) {
    console.error('Add message error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createConsultation,
  getMyConsultations,
  getConsultationById,
  updateConsultationStatus,
  addMessage
}; 