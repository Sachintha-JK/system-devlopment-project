import React, { useState, useEffect } from 'react';
import AccountNbar from '../../component/AccountNbar';
import axios from 'axios';
import moment from 'moment';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

function Spayments() {
  const [supplies, setSupplies] = useState([]);
  const [supplierId, setSupplierId] = useState(null);

  const fetchSupplierId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      const response = await axios.get(`http://localhost:8081/supplier/${userId}`);
      const supplierId = response.data.supplierId;
      setSupplierId(supplierId);
    } catch (error) {
      console.error('Error fetching supplierId:', error);
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, []);

  const fetchSupplierSupplies = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/supply/${supplierId}`);
      console.log('Supply data:', response.data);
      setSupplies(response.data.supplies);
    } catch (error) {
      console.error('Error fetching supplies:', error);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchSupplierSupplies();
    }
  }, [supplierId]);

  return (
    <div>
      <AccountNbar />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Card sx={{ width: '50%', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Payments
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <TableContainer component={Paper} sx={{ width: '90%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Supply No</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div>Spice Type</div>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div>Quantity</div>
                      <div>(kg)</div>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div>Value</div>
                      <div>(LKR)</div>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Delivery Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Total Value (LKR)</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Payment Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {supplies.map((supply) => (
                <TableRow key={supply.Supply_ID}>
                  <TableCell>{supply.Supply_ID}</TableCell>
                  <TableCell>
                    {supply.Spices.split(',').map((item, index) => {
                      const [name, qty, value] = item.split(' - ');
                      return (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ display: 'inline-block', width: '200px' }}>{name}</span>
                          <span style={{ display: 'inline-block', width: '100px' }}>{qty}</span>
                          <span>{value}</span>
                        </Box>
                      );
                    })}
                  </TableCell>
                  <TableCell>{moment(supply.Date).format('MM/DD/YYYY')}</TableCell>
                  <TableCell>{supply.Total_Value}</TableCell>
                  <TableCell>{supply.Payment_Status === 0 ? 'Pending' : 'Paid'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default Spayments;
