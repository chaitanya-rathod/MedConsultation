import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DoctorsList from './pages/DoctorsList';
import DoctorProfile from './pages/DoctorProfile';
import Consultations from './pages/Consultations';
import ConsultationRoom from './pages/ConsultationRoom';
import Prescriptions from './pages/Prescriptions';
import PrescriptionDetails from './pages/PrescriptionDetails';
import Profile from './pages/Profile';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b',
      light: '#48a999',
      dark: '#004c40',
      contrastText: '#fff',
    },
    secondary: {
      main: '#26a69a',
      light: '#64d8cb',
      dark: '#00766c',
      contrastText: '#fff',
    },
    background: {
      default: '#f5f7f7',
      paper: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#60ad5e',
      dark: '#005005',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    info: {
      main: '#0288d1',
      light: '#4dabf5',
      dark: '#005b9f',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#c77700',
    },
    text: {
      primary: '#263238',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #00796b 30%, #26a69a 90%)',
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #26a69a 30%, #4db6ac 90%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
        },
        elevation1: {
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="doctors" element={<DoctorsList />} />
              <Route path="doctors/:id" element={<DoctorProfile />} />
              <Route path="consultations" element={<Consultations />} />
              <Route path="consultations/:id" element={<ConsultationRoom />} />
              <Route path="prescriptions" element={<Prescriptions />} />
              <Route path="prescriptions/:id" element={<PrescriptionDetails />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
