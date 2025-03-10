import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    specialization: '',
    phoneNumber: '',
    address: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const { 
    name, 
    email, 
    password, 
    confirmPassword, 
    role, 
    specialization, 
    phoneNumber, 
    address 
  } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !email || !password || !confirmPassword || !role) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    if (role === 'doctor' && !specialization) {
      setFormError('Specialization is required for doctors');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      // Remove confirmPassword before sending to API
      const userData = { ...formData };
      delete userData.confirmPassword;
      
      await register(userData);
      navigate('/');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          marginBottom: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        
        {(formError || error) && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {formError || error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={role}
                  label="Role"
                  onChange={handleChange}
                >
                  <MenuItem value="patient">Patient</MenuItem>
                  <MenuItem value="doctor">Doctor</MenuItem>
                </Select>
                <FormHelperText>Select your role</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                id="phoneNumber"
                value={phoneNumber}
                onChange={handleChange}
              />
            </Grid>
            {role === 'doctor' && (
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="specialization"
                  label="Specialization"
                  id="specialization"
                  value={specialization}
                  onChange={handleChange}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Address"
                id="address"
                value={address}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 