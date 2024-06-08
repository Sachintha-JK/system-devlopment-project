import React, { useState } from 'react';
import { TextField, Button, Grid, Paper } from '@mui/material';
import axios from 'axios';

function EditSpice({ spice, onSave, onClose }) {
  const [editedSpice, setEditedSpice] = useState({ ...spice });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSpice(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
              required 
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
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
