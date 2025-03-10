const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');

// @desc    Create a new prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor only)
const createPrescription = async (req, res) => {
  try {
    const { consultationId, medications, diagnosis, additionalNotes } = req.body;
    
    // Check if consultation exists
    const consultation = await Consultation.findById(consultationId);
    
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    
    // Check if user is the doctor for this consultation
    if (consultation.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to create prescription for this consultation' });
    }
    
    // Check if prescription already exists for this consultation
    const existingPrescription = await Prescription.findOne({ consultation: consultationId });
    
    if (existingPrescription) {
      return res.status(400).json({ message: 'Prescription already exists for this consultation' });
    }
    
    // Create new prescription
    const prescription = new Prescription({
      patient: consultation.patient,
      doctor: req.user._id,
      consultation: consultationId,
      medications,
      diagnosis,
      additionalNotes
    });
    
    await prescription.save();
    
    // Populate patient and doctor information
    await prescription.populate('patient doctor', 'name email');
    
    res.status(201).json(prescription);
  } catch (error) {
    console.error('Create prescription error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all prescriptions for current user (doctor or patient)
// @route   GET /api/prescriptions
// @access  Private
const getMyPrescriptions = async (req, res) => {
  try {
    let prescriptions;
    
    if (req.user.role === 'doctor') {
      prescriptions = await Prescription.find({ doctor: req.user._id })
        .populate('patient', 'name email profilePicture')
        .populate('consultation', 'scheduledDate status')
        .sort({ createdAt: -1 });
    } else {
      prescriptions = await Prescription.find({ patient: req.user._id })
        .populate('doctor', 'name email profilePicture specialization')
        .populate('consultation', 'scheduledDate status')
        .sort({ createdAt: -1 });
    }
    
    res.json(prescriptions);
  } catch (error) {
    console.error('Get prescriptions error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email profilePicture')
      .populate('doctor', 'name email profilePicture specialization')
      .populate('consultation', 'scheduledDate status reason');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Check if user is authorized to view this prescription
    if (
      prescription.patient._id.toString() !== req.user._id.toString() &&
      prescription.doctor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this prescription' });
    }
    
    res.json(prescription);
  } catch (error) {
    console.error('Get prescription by ID error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor only)
const updatePrescription = async (req, res) => {
  try {
    const { medications, diagnosis, additionalNotes } = req.body;
    
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Check if user is the doctor who created this prescription
    if (prescription.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this prescription' });
    }
    
    // Update fields
    if (medications) prescription.medications = medications;
    if (diagnosis) prescription.diagnosis = diagnosis;
    if (additionalNotes !== undefined) prescription.additionalNotes = additionalNotes;
    
    await prescription.save();
    
    res.json(prescription);
  } catch (error) {
    console.error('Update prescription error:', error.message);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createPrescription,
  getMyPrescriptions,
  getPrescriptionById,
  updatePrescription
}; 