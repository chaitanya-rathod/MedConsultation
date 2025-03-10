import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  Box,
  Divider,
  CircularProgress,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/users/doctors');
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  }, [searchTerm, doctors]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Find a Doctor
      </Typography>
      
      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or specialization"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      
      {filteredDoctors.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">No doctors found matching your search criteria.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={doctor.profilePicture}
                      sx={{ width: 56, height: 56, mr: 2 }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        Dr. {doctor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.specialization}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {doctor.email}
                  </Typography>
                  {doctor.phoneNumber && (
                    <Typography variant="body2" color="text.secondary">
                      Phone: {doctor.phoneNumber}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    component={Link}
                    to={`/doctors/${doctor._id}`}
                    size="small"
                    color="primary"
                    fullWidth
                  >
                    View Profile
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DoctorsList; 