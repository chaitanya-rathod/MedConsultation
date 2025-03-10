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
  useTheme
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  
  const { email, password } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <div className="auth-background"></div>
      <div className="auth-overlay"></div>
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
          className="fade-in"
        >
          <Box 
            sx={{ 
              mb: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}
          >
            <Avatar 
              sx={{ 
                m: 1, 
                bgcolor: 'primary.main', 
                width: 56, 
                height: 56,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              <MedicalServicesIcon fontSize="large" />
            </Avatar>
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                mt: 2, 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              MedConsult
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mt: 1, 
                color: 'text.secondary',
                textAlign: 'center'
              }}
            >
              Professional Medical Consultation Platform
            </Typography>
          </Box>
          
          {(formError || error) && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {formError || error}
            </Alert>
          )}
          
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            noValidate 
            sx={{ mt: 1, width: '100%' }}
            className="fade-in-delay-1"
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handleChange}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                fontSize: '1rem',
                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 15px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-2px)'
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Grid container justifyContent="flex-end" className="fade-in-delay-2">
              <Grid item>
                <Link 
                  component={RouterLink} 
                  to="/register" 
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Box sx={{ mt: 4, textAlign: 'center' }} className="fade-in-delay-3">
          <Typography variant="body2" color="white" sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            © {new Date().getFullYear()} MedConsult. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Login; 