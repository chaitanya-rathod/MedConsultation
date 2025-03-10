import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon,
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const PrescriptionDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/prescriptions/${id}`);
        setPrescription(res.data);
      } catch (err) {
        console.error('Error fetching prescription:', err);
        setError('Failed to load prescription. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrescription();
  }, [id]);
  
  const handlePrint = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error || !prescription) {
    return (
      <Container>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography color="error">{error || 'Prescription not found'}</Typography>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          component={Link}
          to="/prescriptions"
          startIcon={<ArrowBackIcon />}
          sx={{ display: { xs: 'none', sm: 'flex' }, '@media print': { display: 'none' } }}
        >
          Back to Prescriptions
        </Button>
        <Typography variant="h4" component="h1">
          Prescription Details
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{ '@media print': { display: 'none' } }}
        >
          Print
        </Button>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }} id="prescription-to-print">
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Typography variant="h5" gutterBottom>
              {user.role === 'patient' ? 'Doctor' : 'Patient'}
            </Typography>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {user.role === 'patient'
                    ? `Dr. ${prescription.doctor.name}`
                    : prescription.patient.name}
                </Typography>
                {user.role === 'patient' && (
                  <Typography variant="body2" color="text.secondary">
                    {prescription.doctor.specialization}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          
          <Box textAlign="right">
            <Typography variant="body2" color="text.secondary">
              Prescription Date
            </Typography>
            <Typography variant="body1">
              {new Date(prescription.createdAt).toLocaleDateString()}
            </Typography>
            <Chip
              icon={<EventIcon />}
              label={`Consultation: ${new Date(prescription.consultation.scheduledDate).toLocaleDateString()}`}
              color="primary"
              size="small"
              sx={{ mt: 1 }}
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Diagnosis
        </Typography>
        <Typography variant="body1" paragraph>
          {prescription.diagnosis}
        </Typography>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Medications
        </Typography>
        <List>
          {prescription.medications.map((medication, index) => (
            <Paper key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <MedicalServicesIcon />
                    </Avatar>
                    <Typography variant="h6">{medication.name}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box textAlign={{ xs: 'left', sm: 'right' }}>
                    <Chip label={`Dosage: ${medication.dosage}`} size="small" sx={{ mr: 1, mb: 1 }} />
                    <Chip label={`Frequency: ${medication.frequency}`} size="small" sx={{ mr: 1, mb: 1 }} />
                    <Chip label={`Duration: ${medication.duration}`} size="small" sx={{ mb: 1 }} />
                  </Box>
                </Grid>
                {medication.instructions && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Instructions:</strong> {medication.instructions}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          ))}
        </List>
        
        {prescription.additionalNotes && (
          <>
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Additional Notes
            </Typography>
            <Typography variant="body1" paragraph>
              {prescription.additionalNotes}
            </Typography>
          </>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Prescription ID: {prescription._id}
          </Typography>
          <Box textAlign="right">
            <Typography variant="body2" color="text.secondary">
              Issued by
            </Typography>
            <Typography variant="body1">
              Dr. {prescription.doctor.name}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrescriptionDetails; 