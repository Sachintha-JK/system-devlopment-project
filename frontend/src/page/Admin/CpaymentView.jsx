import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import ProfileBar from '../../component/ProfileBar';
import AdminNBar from '../../component/AdminNBar';

import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Checkbox, Card, CardContent, TextField } from '@mui/material';

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomerOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8081/customer_orders');
      console.log('Order data:', response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const handlePaymentStatusChange = async (orderId, currentStatus, index) => {
    const newPaymentStatus = currentStatus === 0 ? 1 : 0;
    const updatedOrders = [...orders];
    updatedOrders[index].Payment_Status = newPaymentStatus;
    setOrders(updatedOrders);
    try {
      const response = await axios.put(`http://localhost:8081/approved_payments/${orderId}`, {
        Payment_Status: newPaymentStatus,
      });
      console.log('Payment status updated:', response.data);
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.Contact_Number.includes(searchTerm)
  );

  return (
    <div>
      <div><ProfileBar pageName="Customer payment" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminNBar /></div>
        <div style={{ flexGrow: 1 }}></div>
    <Box >
      
      <TextField
        fullWidth
        size="small"
        label="Search by name or contact number"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mt: 2, mb: 2, maxWidth: 400 }}
      />

      <Card variant="outlined">
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#000' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Order No</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Customer Name</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Contact Number</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>
                    <Box display="flex" justifyContent="space-between">
                      <Box>Product</Box>
                      <Box>
                        <Box>Quantity</Box>
                        <Box>(kg)</Box>
                      </Box>
                      <Box>
                        <Box>Value</Box>
                        <Box>(LKR)</Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Order Date</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Deliver Date</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Payment</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Payment Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((customer_order, index) => (
                  <TableRow key={customer_order.Order_ID}>
                    <TableCell sx={{ fontSize: '16px' }}>{customer_order.Order_ID}</TableCell>
                    <TableCell sx={{ fontSize: '16px' }}>{customer_order.Name}</TableCell>
                    <TableCell sx={{ fontSize: '16px' }}>{customer_order.Contact_Number}</TableCell>
                    <TableCell sx={{ fontSize: '16px' }}>
                      {customer_order['Product Details'].split(',\n').map((item, idx) => {
                        const [name, qty, value] = item.split(' - ');
                        return (
                          <Box key={idx} display="flex" justifyContent="space-between">
                            <Box component="span" sx={{ width: '200px' }}>{name}</Box>
                            <Box component="span" sx={{ width: '100px' }}>{qty}</Box>
                            <Box component="span">{value}</Box>
                          </Box>
                        );
                      })}
                    </TableCell>
                    <TableCell sx={{ fontSize: '16px' }}>{moment(customer_order.Order_Date).format('MM/DD/YYYY')}</TableCell>
                    <TableCell sx={{ fontSize: '16px' }}>{moment(customer_order.Deliver_Date).format('MM/DD/YYYY')}</TableCell>
                    <TableCell sx={{ fontSize: '16px' }}>{customer_order.Payment}</TableCell>
                    <TableCell sx={{ fontSize: '16px' }}>
                      <Checkbox
                        checked={customer_order.Payment_Status === 1}
                        onChange={() => handlePaymentStatusChange(customer_order.Order_ID, customer_order.Payment_Status, index)}
                        sx={{
                          color: customer_order.Payment_Status === 1 ? 'green' : 'default',
                          '&.Mui-checked': {
                            color: 'green',
                          },
                        }}
                        disabled={customer_order.Payment_Status === 1}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
    </div>
    </div>
  );
}

export default ViewOrders;
