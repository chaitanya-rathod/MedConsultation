import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Person as PersonIcon,
  MedicalServices as MedicalServicesIcon
} from '@mui/icons-material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Prescriptions = () => {
  const { user } = useContext(AuthContext);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/prescriptions');
        setPrescriptions(res.data);
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
        setError('Failed to load prescriptions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  // Sort prescriptions by date (newest first)
  const sortedPrescriptions = [...prescriptions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Prescriptions
      </Typography>

      {sortedPrescriptions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No prescriptions found.</Typography>
          {user.role === 'patient' && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/doctors"
              sx={{ mt: 2 }}
            >
              Book a Consultation
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sortedPrescriptions.map((prescription) => (
            <Grid item xs={12} key={prescription._id}>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Box display="flex" alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          <DescriptionIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <Box>
                        <Typography variant="h6" component="h2">
                          {user.role === 'patient'
                            ? `Dr. ${prescription.doctor.name}`
                            : prescription.patient.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </Typography>
                        <Box mt={1}>
                          <Typography variant="subtitle1">
                            <strong>Diagnosis:</strong> {prescription.diagnosis}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Medications:</strong>
                          </Typography>
                          <List dense>
                            {prescription.medications.map((med, index) => (
                              <ListItem key={index} sx={{ pl: 0 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                                    <MedicalServicesIcon sx={{ fontSize: 16 }} />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={med.name}
                                  secondary={`${med.dosage}, ${med.frequency}, ${med.duration}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                      height="100%"
                      justifyContent="space-between"
                    >
                      <Chip
                        icon={<PersonIcon />}
                        label={
                          user.role === 'patient'
                            ? `Dr. ${prescription.doctor.specialization}`
                            : 'Patient'
                        }
                        color="primary"
                        variant="outlined"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/prescriptions/${prescription._id}`}
                        sx={{ mt: 2 }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Prescriptions; 