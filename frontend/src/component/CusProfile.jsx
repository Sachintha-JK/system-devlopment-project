import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import axios from 'axios';

function ImageUploadForm() {
  const [image, setImage] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    // Fetch customer data when component mounts
    const fetchCustomerData = async () => {
      try {
        const userId = 'your_user_id'; // Replace 'your_user_id' with the actual user ID
        const response = await axios.get(`/customer/${userId}`);
        setCustomerData(response.data);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchCustomerData();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button variant="contained" component="span">
            Upload Image
          </Button>
        </label>
      </Grid>
      {image && (
        <Grid item xs={12}>
          <img src={image} alt="Uploaded" style={{ maxWidth: '100%' }} />
        </Grid>
      )}
      {customerData && (
        <Grid item xs={12}>
          <p>Customer ID: {customerData.Customer_ID}</p>
          <p>Company Name: {customerData.Company_Name}</p>
          <p>Name: {customerData.Name}</p>
          <p>Contact Number: {customerData.Contact_Number}</p>
          <p>Email: {customerData.Email}</p>
        </Grid>
      )}
    </Grid>
  );
}

export default ImageUploadForm;
