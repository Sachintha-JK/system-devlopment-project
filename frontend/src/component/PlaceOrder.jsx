import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';
import moment from 'moment';
import { Paper } from '@mui/material';

import { ToastContainer, toast } from 'react-toastify';
import CustomerBar from '../../component/CustomerBar';
import 'react-toastify/dist/ReactToastify.css';
import SpicesList from '../../component/Availability';

function CusPayment() {
  const [spices, setSpices] = useState([]);
  const [formFields, setFormFields] = useState([{ spice: '', quantity: '' }]);
  const [ordervalue, setOrderValue] = useState(0);
  const [deliverDate, setDeliverDate] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [showSpicesList, setShowSpicesList] = useState(false);

  const fetchCustomerId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      const response = await axios.get(`http://localhost:8081/customer/${userId}`);
      const customerId = response.data.customerId;
      setCustomerId(customerId);
    } catch (error) {
      console.error('Error fetching customerId:', error);
    }
  };

  const fetchCustomerOrders = async () => {
    // Implement fetchCustomerOrders function
  };

  useEffect(() => {
    fetchCustomerId(); // Call fetchCustomerId on component mount

    const fetchSpices = async () => {
      try {
        const response = await axios.get('http://localhost:8081/spices');
        setSpices(response.data);
      } catch (error) {
        console.error('Error fetching Spices:', error);
      }
    };

    fetchSpices();
  }, []);

  const addFormField = () => {
    setFormFields([...formFields, { spice: '', quantity: '' }]);
  };

  const handleFormChange = (index, event) => {
    const updatedFields = formFields.map((field, i) =>
      i === index ? { ...field, [event.target.name]: event.target.value } : field
    );
    setFormFields(updatedFields);
    calculateOrderValue(updatedFields);
  };

  const calculateOrderValue = (fields) => {
    let total = 0;
    fields.forEach(field => {
      const spice = spices.find(p => p.Spice_Name === field.spice);
      if (spice && field.quantity) {
        total += spice.Selling_Price * field.quantity;
      }
    });
    setOrderValue(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderDate = moment().format('YYYY-MM-DD');
    let adjustedDeliverDate = deliverDate; // Initialize with the selected deliverDate
  
    try {
      const orderItems = formFields.map(field => {
        const spice = spices.find(s => s.Spice_Name === field.spice);
        const quantity = parseInt(field.quantity);
        return {
          Spice_ID: spice.Spice_ID,
          Quantity: quantity,
          Value: field.quantity * spice.Selling_Price,
        };
      });
  
      // Check if any spice exceeds stock limit
      let canPlaceOrder = true;
      for (const item of orderItems) {
        const spice = spices.find(s => s.Spice_ID === item.Spice_ID);
        const spiceStock = spice.Stock; // Define spiceStock variable
        if (spiceStock && item.Quantity - spiceStock > 200) {
          if (moment(adjustedDeliverDate).diff(moment(orderDate), 'days') < 7) {
            canPlaceOrder = false;
            adjustedDeliverDate = moment().add(7, 'days').format('YYYY-MM-DD');
            break; // Exit the loop after adjusting delivery date for one item
          }
        }
      }
  
      if (!canPlaceOrder) {
        toast.info(`Order cannot be placed as the quantity for some spices exceeds stock levels by over 200kg and the delivery date is less than one week from now. Please select a delivery date after ${adjustedDeliverDate} or reduce the quantity.`);
        setDeliverDate(adjustedDeliverDate); // Update the state with adjusted date
        return;
      }
  
      // Continue with order placement
      const orderData = {
        Customer_ID: customerId,
        Order_Date: orderDate,
        Deliver_Date: adjustedDeliverDate,
        orderItems: orderItems,
      };
  
      const response = await axios.post('http://localhost:8081/plce_order', orderData);
  
      toast.success('Order placed successfully!');
      // Clear form fields only after successful order placement
      setFormFields([{ spice: '', quantity: '' }]);
      setDeliverDate('');
      setOrderValue(0);
      fetchCustomerOrders();
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div><CustomerBar /></div>
    
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Typography variant="h4" align="center">Order Details</Typography>
      </Paper>
      <br/>
      <br/>
      <Box textAlign="center" mt={2} mb={2} sx={{ marginLeft: '-750px' }}>
        <Button variant="contained" color="primary" onClick={() => setShowSpicesList(true)}>
          Check Spice Availability
        </Button>
        <SpicesList show={showSpicesList} handleClose={() => setShowSpicesList(false)} />
      </Box>
    
      <Card variant="outlined" sx={{ maxWidth: 1000, margin: '0 auto' }}> {/* Increased card width */}
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} sx={{ mt: 3 }}>
              <Typography variant="h6">Dear valued customer,</Typography>
              <Typography variant="body1" paragraph>
                We appreciate your interest in our products and services. To maintain stock efficiency and ensure quality service for orders over 200kg, we have established the following:
              </Typography>
              <Typography variant="body1" paragraph>
                <ul>
                  <li>Orders exceeding 200kg require one week for processing to assess inventory and ensure timely delivery.</li>
                  <li>Upon order receipt, we promptly confirm spice availability.</li>
                  <li>If only a portion of your requested quantity is available, we will inform you for confirmation.</li>
                </ul>
              </Typography>
              <Typography variant="body1" paragraph>
                Your understanding and patience are appreciated as we aim to meet your needs to the fullest.
              </Typography>
              <Typography variant="h6">Best regards,</Typography>
              <Typography variant="body1">Manager</Typography>
              <Typography variant="body1">Vikum Spice Shop</Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mt: 3 }}>
              <Box sx={{ height: '100%', borderLeft: '1px solid grey', pl: 2 }}>
                <form onSubmit={handleSubmit}>
                  {formFields.map((field, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <TextField
                        select
                        name="spice"
                        label="Spice Type"
                        value={field.spice}
                        onChange={(e) => handleFormChange(index, e)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                      >
                        <MenuItem value="">
                          <em>Select the Spice</em>
                        </MenuItem>
                        {spices.map((spice) => (
                          <MenuItem key={spice.Spice_Name} value={spice.Spice_Name}>
                            {spice.Spice_Name}
                          </MenuItem>
                        ))}
                      </TextField>
    
                      <TextField
                        type="number"
                        name="quantity"
                        label="Quantity"
                        placeholder="Add the Quantity"
                        value={field.quantity}
                        onChange={(e) => handleFormChange(index, e)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        sx={{ mx: 2 }}
                      />
    
                      {index === formFields.length - 1 && (
                        <Tooltip title="Add more Spice Types">
                          <IconButton color="primary" onClick={addFormField}>
                            <AddCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  ))}
    
                  <TextField
                    type="date"
                    label="Delivery Date"
                    value={deliverDate}
                    onChange={(e) => setDeliverDate(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
    
                  <Box mt={2}>
                    <Tooltip title="Submit your order">
                      <Button variant="contained" color="primary" type="submit">
                        Submit
                      </Button>
                    </Tooltip>
                  </Box>
                </form>
    
                <Box mt={2}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">Order Value</Typography>
                      <Typography variant="h4">Rs {ordervalue.toFixed(2)}</Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    
      <ToastContainer />
    </div>
  );
}

export default CusPayment;
