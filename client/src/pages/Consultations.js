import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Person as PersonIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Consultations = () => {
  const { user } = useContext(AuthContext);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/consultations');
        setConsultations(res.data);
      } catch (err) {
        console.error('Error fetching consultations:', err);
        setError('Failed to load consultations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/consultations/${id}/status`, { status });
      
      // Update local state
      setConsultations(
        consultations.map((consultation) =>
          consultation._id === id ? { ...consultation, status } : consultation
        )
      );
    } catch (err) {
      console.error('Error updating consultation status:', err);
      alert('Failed to update consultation status');
    }
  };

  // Helper function to format dates safely
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  // Helper function to format times safely
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Time';
      }
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };

  // Check if a date is in the past
  const isDatePast = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return false;
      }
      return date < new Date();
    } catch (error) {
      console.error('Error checking if date is past:', error);
      return false;
    }
  };

  // Check if a consultation can be joined (within 15 minutes of scheduled time)
  const canJoinConsultation = (dateString) => {
    try {
      const scheduledDate = new Date(dateString);
      if (isNaN(scheduledDate.getTime())) {
        return false;
      }
      const now = new Date();
      const timeDiff = Math.abs(scheduledDate - now);
      return timeDiff < 1000 * 60 * 15; // Within 15 minutes
    } catch (error) {
      console.error('Error checking if consultation can be joined:', error);
      return false;
    }
  };

  // Filter consultations based on tab
  const filteredConsultations = consultations.filter((consultation) => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return consultation.status === 'scheduled';
    if (tabValue === 2) return consultation.status === 'completed';
    if (tabValue === 3) return consultation.status === 'cancelled';
    return true;
  });

  // Sort consultations by date (most recent first)
  const sortedConsultations = [...filteredConsultations].sort((a, b) => {
    try {
      return new Date(b.scheduledDate) - new Date(a.scheduledDate);
    } catch (error) {
      console.error('Error sorting consultations:', error);
      return 0;
    }
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Consultations
        </Typography>
        {user.role === 'patient' && (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/doctors"
            startIcon={<VideoCallIcon />}
          >
            Book New Consultation
          </Button>
        )}
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All" />
          <Tab label="Scheduled" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : sortedConsultations.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No consultations found
          </Typography>
          {user.role === 'patient' && (
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/doctors"
              sx={{ mt: 2 }}
            >
              Book Your First Consultation
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {sortedConsultations.map((consultation) => {
            const isPast = isDatePast(consultation.scheduledDate);
            const canJoin = consultation.status === 'scheduled' && canJoinConsultation(consultation.scheduledDate);
            
            return (
              <Grid item xs={12} key={consultation._id}>
                <Paper sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <Box display="flex" alignItems="center">
                        <ListItemAvatar>
                          <Avatar>
                            {user.role === 'patient' ? (
                              <PersonIcon />
                            ) : (
                              <PersonIcon />
                            )}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            user.role === 'patient'
                              ? `Dr. ${consultation.doctor?.name || 'Unknown Doctor'}`
                              : consultation.patient?.name || 'Unknown Patient'
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {formatDate(consultation.scheduledDate)} at{' '}
                                {formatTime(consultation.scheduledDate)}
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2">
                                Duration: {consultation.duration || 30} minutes
                              </Typography>
                              <br />
                              <Typography component="span" variant="body2">
                                Reason: {consultation.reason || 'Not specified'}
                              </Typography>
                            </>
                          }
                        />
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
                          label={consultation.status}
                          color={
                            consultation.status === 'scheduled'
                              ? 'primary'
                              : consultation.status === 'completed'
                              ? 'success'
                              : 'error'
                          }
                          icon={
                            consultation.status === 'scheduled' ? (
                              <EventIcon />
                            ) : consultation.status === 'completed' ? (
                              <CheckCircleIcon />
                            ) : (
                              <CancelIcon />
                            )
                          }
                          sx={{ mb: 2 }}
                        />
                        <Box>
                          {consultation.status === 'scheduled' && !isPast && (
                            <Button
                              variant="contained"
                              color="primary"
                              component={Link}
                              to={`/consultations/${consultation._id}`}
                              startIcon={<VideoCallIcon />}
                              fullWidth
                              sx={{ mb: 1 }}
                              disabled={!canJoin}
                            >
                              {canJoin ? 'Join Consultation' : 'Not Yet Available'}
                            </Button>
                          )}
                          
                          {consultation.status === 'scheduled' && (
                            <Button
                              variant="outlined"
                              color="error"
                              fullWidth
                              onClick={() => handleStatusChange(consultation._id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          )}
                          
                          {consultation.status === 'scheduled' && isPast && user.role === 'doctor' && (
                            <Button
                              variant="outlined"
                              color="success"
                              fullWidth
                              onClick={() => handleStatusChange(consultation._id, 'completed')}
                              sx={{ mt: 1 }}
                            >
                              Mark as Completed
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Consultations; 