import React, { useState } from 'react';
import { Modal, Button, TextField, Typography, Grid } from '@mui/material';
import axios from 'axios';

function EditCustomerForm({ customer, handleClose }) {
  const [name, setName] = useState(customer.Name);
  const [contactNumber, setContactNumber] = useState(customer.Contact_Number);
  const [email, setEmail] = useState(customer.Email);
  const [companyName, setCompanyName] = useState(customer.Company_Name);

  const [errors, setErrors] = useState({
    name: '',
    contactNumber: '',
    email: '',
    companyName: ''
  });

  const validateName = (name) => {
    if (!/^[A-Za-z\s]+$/.test(name)) {
      return 'Name can only contain letters.';
    }
    if (name.length > 40) {
      return 'Name can be a maximum of 40 characters.';
    }
    return '';
  };

  const validateContactNumber = (number) => {
    if (!/^0\d{9}$/.test(number)) {
      return 'Contact number must be 10 digits and start with 0.';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Invalid email address.';
    }
    return '';
  };

  const validateCompanyName = (name) => {
    if (name.length > 50) {
      return 'Company name can be a maximum of 50 characters.';
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(name),
      contactNumber: validateContactNumber(contactNumber),
      email: validateEmail(email),
      companyName: validateCompanyName(companyName)
    };

    setErrors(newErrors);

    // Return true if no errors
    return Object.values(newErrors).every(error => error === '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Make API call to update customer data
      const response = await axios.put(`http://localhost:8081/updatecustomer/${customer.Customer_ID}`, {
        Name: name,
        Company_Name: companyName,
        Contact_Number: contactNumber,
        Email: email,
      });

      // Check if the update was successful
      if (response.status === 200) {
        // If successful, close the modal
        handleClose();
      } else {
        // Handle error if update was not successful
        console.error('Failed to update customer data');
        // Optionally, you can show an error message to the user
      }
    } catch (error) {
      // Handle any errors from the API call
      console.error('Error updating customer data:', error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <Modal open={true} onClose={handleClose} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', width: '400px' }}>
        <Typography variant="h5" gutterBottom>Edit Customer</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Number"
                variant="outlined"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                error={!!errors.contactNumber}
                helperText={errors.contactNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                variant="outlined"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                error={!!errors.companyName}
                helperText={errors.companyName}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Modal>
  );
}

export default EditCustomerForm;
