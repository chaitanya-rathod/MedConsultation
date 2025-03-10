import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  LocalHospital as LocalHospitalIcon
} from '@mui/icons-material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [consultations, setConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch consultations
        const consultationsRes = await axios.get('http://localhost:5000/api/consultations');
        setConsultations(consultationsRes.data);

        // Fetch prescriptions
        const prescriptionsRes = await axios.get('http://localhost:5000/api/prescriptions');
        setPrescriptions(prescriptionsRes.data);

        // If user is a patient, fetch doctors
        if (user.role === 'patient') {
          const doctorsRes = await axios.get('http://localhost:5000/api/users/doctors');
          setDoctors(doctorsRes.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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

  // Get upcoming consultations (scheduled and not in the past)
  const upcomingConsultations = consultations
    .filter(
      (consultation) =>
        consultation.status === 'scheduled' &&
        new Date(consultation.scheduledDate) > new Date()
    )
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 3);

  // Get recent prescriptions
  const recentPrescriptions = prescriptions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <>
      <div className="dashboard-background"></div>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={3}>
          {/* Welcome Card */}
          <Grid item xs={12} className="fade-in">
            <Paper
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                color: 'white',
                borderRadius: '16px',
                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              className="medical-icon-bg"
            >
              <Box sx={{ zIndex: 1 }}>
                <Typography component="h1" variant="h3" gutterBottom fontWeight="bold">
                  Welcome, {user.name}!
                </Typography>
                <Typography variant="h6" sx={{ maxWidth: '600px', opacity: 0.9 }}>
                  {user.role === 'patient'
                    ? 'Manage your consultations and prescriptions all in one place. Your health is our priority.'
                    : 'Manage your patients, consultations, and prescriptions efficiently. Provide the best care possible.'}
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  display: { xs: 'none', md: 'block' },
                  mt: { xs: 3, md: 0 }
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {user.role === 'doctor' ? (
                    <LocalHospitalIcon sx={{ fontSize: 60 }} />
                  ) : (
                    <PersonIcon sx={{ fontSize: 60 }} />
                  )}
                </Avatar>
              </Box>
              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  right: -20,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 0
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: -30,
                  left: -30,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  zIndex: 0
                }}
              />
            </Paper>
          </Grid>

          {/* Quick Stats */}
          <Grid item xs={12} md={4} className="fade-in-delay-1">
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: '16px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.primary.main, 
                      mr: 2,
                      width: 56,
                      height: 56,
                      boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)'
                    }}
                  >
                    <VideoCallIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Consultations
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="primary">
                      {consultations.length}
                    </Typography>
                  </Box>
                </Box>
                <Box 
                  sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    color: theme.palette.success.main
                  }}
                >
                  <TrendingUpIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    {upcomingConsultations.length} upcoming
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  component={Link}
                  to="/consultations"
                  size="small"
                  color="primary"
                  fullWidth
                  endIcon={<VideoCallIcon />}
                >
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} className="fade-in-delay-1">
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: '16px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.secondary.main, 
                      mr: 2,
                      width: 56,
                      height: 56,
                      boxShadow: '0 4px 10px rgba(233, 30, 99, 0.3)'
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Prescriptions
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="secondary">
                      {prescriptions.length}
                    </Typography>
                  </Box>
                </Box>
                <Box 
                  sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    color: theme.palette.info.main
                  }}
                >
                  <DescriptionIcon sx={{ mr: 1, fontSize: 20 }} />
                  <Typography variant="body2">
                    {recentPrescriptions.length} recent
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  component={Link}
                  to="/prescriptions"
                  size="small"
                  color="secondary"
                  fullWidth
                  endIcon={<DescriptionIcon />}
                >
                  View All
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} className="fade-in-delay-1">
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: '16px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)'
                }
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    sx={{ 
                      bgcolor: theme.palette.success.main, 
                      mr: 2,
                      width: 56,
                      height: 56,
                      boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)'
                    }}
                  >
                    {user.role === 'patient' ? (
                      <PersonIcon sx={{ fontSize: 30 }} />
                    ) : (
                      <EventIcon sx={{ fontSize: 30 }} />
                    )}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {user.role === 'patient' ? 'Doctors' : 'Upcoming'}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" color="success.main">
                      {user.role === 'patient'
                        ? doctors.length
                        : upcomingConsultations.length}
                    </Typography>
                  </Box>
                </Box>
                <Box 
                  sx={{ 
                    mt: 2, 
                    display: 'flex', 
                    alignItems: 'center',
                    color: theme.palette.warning.main
                  }}
                >
                  {user.role === 'patient' ? (
                    <>
                      <LocalHospitalIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">
                        Available for consultation
                      </Typography>
                    </>
                  ) : (
                    <>
                      <EventIcon sx={{ mr: 1, fontSize: 20 }} />
                      <Typography variant="body2">
                        Scheduled sessions
                      </Typography>
                    </>
                  )}
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  component={Link}
                  to={user.role === 'patient' ? '/doctors' : '/consultations'}
                  size="small"
                  color="success"
                  fullWidth
                  endIcon={user.role === 'patient' ? <PersonIcon /> : <EventIcon />}
                >
                  {user.role === 'patient' ? 'Find Doctors' : 'View Schedule'}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Upcoming Consultations */}
          <Grid item xs={12} md={6} className="fade-in-delay-2">
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: '16px',
                height: '100%'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2 
                }}
              >
                <EventIcon 
                  sx={{ 
                    mr: 1, 
                    color: theme.palette.primary.main,
                    fontSize: 28
                  }} 
                />
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Upcoming Consultations
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {upcomingConsultations.length > 0 ? (
                <List>
                  {upcomingConsultations.map((consultation) => (
                    <ListItem
                      key={consultation._id}
                      button
                      component={Link}
                      to={`/consultations/${consultation._id}`}
                      divider
                      sx={{
                        borderRadius: '8px',
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.08)'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: theme.palette.primary.main,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                          }}
                        >
                          <VideoCallIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {user.role === 'patient'
                              ? `Dr. ${consultation.doctor.name}`
                              : consultation.patient.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.primary">
                              {new Date(consultation.scheduledDate).toLocaleDateString()} at{' '}
                              {new Date(consultation.scheduledDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {consultation.reason.substring(0, 60)}
                              {consultation.reason.length > 60 ? '...' : ''}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderRadius: '8px'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No upcoming consultations.
                  </Typography>
                </Box>
              )}
              {upcomingConsultations.length > 0 && (
                <Box mt={2} textAlign="right">
                  <Button
                    component={Link}
                    to="/consultations"
                    color="primary"
                    endIcon={<VideoCallIcon />}
                  >
                    View All Consultations
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Recent Prescriptions */}
          <Grid item xs={12} md={6} className="fade-in-delay-2">
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: '16px',
                height: '100%'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2 
                }}
              >
                <DescriptionIcon 
                  sx={{ 
                    mr: 1, 
                    color: theme.palette.secondary.main,
                    fontSize: 28
                  }} 
                />
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Recent Prescriptions
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {recentPrescriptions.length > 0 ? (
                <List>
                  {recentPrescriptions.map((prescription) => (
                    <ListItem
                      key={prescription._id}
                      button
                      component={Link}
                      to={`/prescriptions/${prescription._id}`}
                      divider
                      sx={{
                        borderRadius: '8px',
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'rgba(233, 30, 99, 0.08)'
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: theme.palette.secondary.main,
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                          }}
                        >
                          <DescriptionIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" fontWeight="medium">
                            {user.role === 'patient'
                              ? `Dr. ${prescription.doctor.name}`
                              : prescription.patient.name}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.primary">
                              {new Date(prescription.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Diagnosis: {prescription.diagnosis.substring(0, 60)}
                              {prescription.diagnosis.length > 60 ? '...' : ''}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box 
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderRadius: '8px'
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    No prescriptions yet.
                  </Typography>
                </Box>
              )}
              {recentPrescriptions.length > 0 && (
                <Box mt={2} textAlign="right">
                  <Button
                    component={Link}
                    to="/prescriptions"
                    color="secondary"
                    endIcon={<DescriptionIcon />}
                  >
                    View All Prescriptions
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} className="fade-in-delay-3">
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: '16px'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2 
                }}
              >
                <DashboardIcon 
                  sx={{ 
                    mr: 1, 
                    color: theme.palette.info.main,
                    fontSize: 28
                  }} 
                />
                <Typography variant="h5" component="h2" fontWeight="bold">
                  Quick Actions
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={2}>
                {user.role === 'patient' && (
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      component={Link}
                      to="/doctors"
                      startIcon={<PersonIcon />}
                      sx={{ 
                        py: 1.5,
                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                        boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                      }}
                    >
                      Find a Doctor
                    </Button>
                  </Grid>
                )}
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    component={Link}
                    to="/consultations"
                    startIcon={<VideoCallIcon />}
                    sx={{ 
                      py: 1.5,
                      background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
                      boxShadow: '0 4px 10px rgba(233, 30, 99, 0.3)',
                    }}
                  >
                    {user.role === 'patient'
                      ? 'Book Consultation'
                      : 'View Consultations'}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    component={Link}
                    to="/prescriptions"
                    startIcon={<DescriptionIcon />}
                    sx={{ 
                      py: 1.5,
                      background: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
                      boxShadow: '0 4px 10px rgba(76, 175, 80, 0.3)',
                    }}
                  >
                    View Prescriptions
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    color="info"
                    fullWidth
                    component={Link}
                    to="/profile"
                    startIcon={<PersonIcon />}
                    sx={{ 
                      py: 1.5,
                      background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
                      boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
                    }}
                  >
                    Update Profile
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard; 