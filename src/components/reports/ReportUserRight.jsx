import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ReportUserRight() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    noOfPerson: '',
    timeSlot: ''
  });
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch time slots on component mount
  useEffect(() => {
    const fetchTimeSlots = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/api/timeslots-for-registration');
        const data = await response.json();
        if (data.success) {
          setTimeSlots(data.timeSlots || []);
        } else {
          setError(data.message || 'Failed to fetch time slots.');
        }
      } catch (err) {
        console.error("Error fetching time slots:", err);
        setError('Could not connect to the server to get time slots.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    // Basic Validation - exactly as requested: Name, Phone, NoofPerson, TimeSlot
    if (!formData.name || !formData.phone || !formData.noOfPerson || !formData.timeSlot) {
      setError('All fields are required. Please fill out the entire form.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/register-member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          noOfPerson: formData.noOfPerson,
          timeSlot: formData.timeSlot
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Registration successful!');
        // Clear form after successful submission
        setFormData({
          name: '',
          phone: '',
          noOfPerson: '',
          timeSlot: ''
        });
      } else {
        setError(data.message || 'Failed to save registration.');
      }
    } catch (err) {
      console.error("Error saving registration:", err);
      setError('Could not connect to the server to save the registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ maxWidth: 600, margin: 'auto', position: 'relative' }}>
        {loading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2
          }}>
            <CircularProgress />
          </Box>
        )}
        <CardContent>
          <Typography variant="h5" component="div" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
            New Member Registration
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

          <Grid container spacing={2}>
            {/* 1. Name text field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                variant="outlined"
                disabled={loading}
              />
            </Grid>
            
            {/* 2. Phone text field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                variant="outlined"
                disabled={loading}
              />
            </Grid>
            
            {/* 3. NoofPerson text field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Number of Persons"
                name="noOfPerson"
                type="number"
                value={formData.noOfPerson}
                onChange={handleInputChange}
                variant="outlined"
                disabled={loading}
              />
            </Grid>
            
            {/* 4. TimeSlot dropdown list */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Time Slot</InputLabel>
                <Select
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleInputChange}
                  label="Time Slot"
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>-- Select a Time Slot --</em>
                  </MenuItem>
                  {timeSlots.map((slot, index) => (
                    <MenuItem key={index} value={slot}>{slot}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* 5. Save Button and 6. Close Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSave} 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleClose} 
              disabled={loading}
            >
              Close
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ReportUserRight;