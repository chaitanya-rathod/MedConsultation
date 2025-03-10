import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Avatar,
  Button,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [consultationData, setConsultationData] = useState({
    scheduledDate: new Date(new Date().setHours(new Date().getHours() + 1)),
    duration: 30,
    reason: ''
  });
  
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/users/doctors/${id}`);
        setDoctor(res.data);
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Failed to load doctor information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctor();
  }, [id]);
  
  const handleConsultationChange = (e) => {
    setConsultationData({
      ...consultationData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleDateChange = (newDate) => {
    setConsultationData({
      ...consultationData,
      scheduledDate: newDate
    });
  };
  
  const handleBookConsultation = async (e) => {
    e.preventDefault();
    
    if (!consultationData.reason) {
      setBookingError('Please provide a reason for the consultation');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setBookingError('');
      setBookingSuccess('');
      
      const res = await axios.post('http://localhost:5000/api/consultations', {
        doctorId: id,
        scheduledDate: consultationData.scheduledDate,
        duration: consultationData.duration,
        reason: consultationData.reason
      });
      
      setBookingSuccess('Consultation booked successfully!');
      
      // Reset form
      setConsultationData({
        scheduledDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        duration: 30,
        reason: ''
      });
      
      // Redirect to consultations page after a short delay
      setTimeout(() => {
        navigate('/consultations');
      }, 2000);
      
    } catch (err) {
      console.error('Error booking consultation:', err);
      setBookingError(err.response?.data?.message || 'Failed to book consultation');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !doctor) {
    return (
      <Container>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography color="error">{error || 'Doctor not found'}</Typography>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Doctor Profile */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar
                src={doctor.profilePicture}
                sx={{ width: 80, height: 80, mr: 2 }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1">
                  Dr. {doctor.name}
                </Typography>
                <Typography variant="h6" color="primary">
                  {doctor.specialization}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box display="flex" alignItems="center" mb={2}>
              <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <Typography>{doctor.email}</Typography>
            </Box>
            
            {doctor.phoneNumber && (
              <Box display="flex" alignItems="center" mb={2}>
                <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography>{doctor.phoneNumber}</Typography>
              </Box>
            )}
            
            <Box display="flex" alignItems="center" mb={2}>
              <MedicalServicesIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <Typography>{doctor.specialization}</Typography>
            </Box>
            
            {doctor.address && (
              <Typography variant="body1" paragraph>
                <strong>Address:</strong> {doctor.address}
              </Typography>
            )}
          </Paper>
        </Grid>
        
        {/* Book Consultation Form */}
        {user && user.role === 'patient' && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Book a Consultation
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {bookingSuccess && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {bookingSuccess}
                </Alert>
              )}
              
              {bookingError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {bookingError}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleBookConsultation}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Consultation Date & Time"
                    value={consultationData.scheduledDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth margin="normal" required />
                    )}
                  />
                </LocalizationProvider>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel id="duration-label">Duration</InputLabel>
                  <Select
                    labelId="duration-label"
                    name="duration"
                    value={consultationData.duration}
                    label="Duration"
                    onChange={handleConsultationChange}
                  >
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={45}>45 minutes</MenuItem>
                    <MenuItem value={60}>60 minutes</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  margin="normal"
                  name="reason"
                  label="Reason for Consultation"
                  multiline
                  rows={4}
                  value={consultationData.reason}
                  onChange={handleConsultationChange}
                  
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : 'Book Consultation'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default DoctorProfile; 