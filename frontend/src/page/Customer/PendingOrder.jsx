import React, { useState, useEffect } from 'react';
import CustomerBar from '../../component/CustomerBar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';
import moment from 'moment';

function Cpayments() {
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState(null);

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

  useEffect(() => {
    fetchCustomerId();
  }, []);

  const fetchCustomerOrders = async () => {
    try {
      console.log('Fetching customer orders...');
      const response = await axios.get(`http://localhost:8081/customer_allorder/${customerId}`);
      console.log('Order data:', response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Display an error message to the user
      // Example: setError('Failed to fetch orders. Please try again later.');
    }
  };
  
  
  useEffect(() => {
    if (customerId) {
      fetchCustomerOrders();
    }
  }, [customerId]);

  return (
    <div>
      <div><CustomerBar/></div>
     
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Order Number</TableCell>
                <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>Spice Type</div>
                    <div>
                      <div>Quantity</div>
                      <div>(kg)</div>
                    </div>
                    <div>
                      <div>Value</div>
                      <div>(LKR)</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Deliver Date</TableCell>
                <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Value (LKR)</TableCell>
                <TableCell style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((customer_order) => (
                <TableRow key={customer_order.Order_ID}>
                  <TableCell>{customer_order.Order_ID}</TableCell>
                  <TableCell>
                    {customer_order.Spices.split(',').map((item, index) => {
                      const [name, qty, value] = item.split(' - ');
                      return (
                        <div key={index}>
                          <span style={{ display: 'inline-block', width: '200px' }}>{name}</span>
                          <span style={{ display: 'inline-block', width: '100px' }}>{qty}</span>
                          <span>{value}</span>
                        </div>
                      );
                    })}
                  </TableCell>
                  <TableCell>{moment(customer_order.Deliver_Date).format('MM/DD/YYYY')}</TableCell>
                  <TableCell>{customer_order.Total_Value}</TableCell>
                  <TableCell>
  {customer_order.Accept_Status === 0 ? 'Rejected' : 
   (customer_order.Accept_Status === 1 ? 'Accepted' : 'Pending')}
</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Cpayments;
