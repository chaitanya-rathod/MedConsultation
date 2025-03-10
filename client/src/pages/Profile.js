import React, { useState, useContext } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Person as PersonIcon, Save as SaveIcon } from '@mui/icons-material';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    specialization: user?.specialization || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : null,
    profilePicture: user?.profilePicture || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dateOfBirth: date
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError('');
      setSuccess('');
      
      await updateProfile(formData);
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        <Box display="flex" alignItems="center" mb={3}>
          <Avatar
            src={formData.profilePicture}
            sx={{ width: 100, height: 100, mr: 3 }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body1" color="text.secondary">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              {user.role === 'doctor' && user.specialization && ` - ${user.specialization}`}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                disabled
                helperText="Email cannot be changed"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            {user.role === 'doctor' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile Picture URL"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleChange}
                helperText="Enter a URL for your profile picture"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<SaveIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 