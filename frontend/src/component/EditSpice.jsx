import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

function EditSpice({ spice, onSave, onClose }) {
  const [editedSpice, setEditedSpice] = useState({ ...spice });
  const [errors, setErrors] = useState({
    Spice_Name: '',
    Buying_Price: '',
    Selling_Price: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSpice(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Validation
    let newErrors = { ...errors };

    if (name === 'Spice_Name') {
      newErrors.Spice_Name = value.length > 40 ? 'Spice name must be 40 characters or less.' : '';
    }

    if (name === 'Buying_Price' || name === 'Selling_Price') {
      newErrors[name] = value <= 0 ? 'Price must be a positive number.' : '';
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure no validation errors before submitting
    if (Object.values(errors).some(error => error)) {
      console.error('Validation errors:', errors);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8081/editspice/${spice.Spice_ID}`, editedSpice);
      if (response.data.success) {
        onSave(editedSpice);
      }
    } catch (error) {
      console.error('Error editing spice:', error);
      // Handle error
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'white', maxWidth: '400px', margin: '0 auto' }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField 
              fullWidth
              label="Spice Name"
              variant="outlined"
              name="Spice_Name"
              value={editedSpice.Spice_Name}
              onChange={handleChange}
              error={!!errors.Spice_Name}
              helperText={errors.Spice_Name}
              required 
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth
              label="Buying Price"
              variant="outlined"
              type="number"
              name="Buying_Price"
              value={editedSpice.Buying_Price}
              onChange={handleChange}
              error={!!errors.Buying_Price}
              helperText={errors.Buying_Price}
              required 
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              fullWidth
              label="Selling Price"
              variant="outlined"
              type="number"
              name="Selling_Price"
              value={editedSpice.Selling_Price}
              onChange={handleChange}
              error={!!errors.Selling_Price}
              helperText={errors.Selling_Price}
              required 
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" disabled={Object.values(errors).some(error => error)}>
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={onClose} style={{ marginLeft: '10px' }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

export default EditSpice;
