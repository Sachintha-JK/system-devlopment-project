import React, { useState, useEffect } from 'react';
import SupplierBar from '../../component/SupplierBar';
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
  TextField,
  Button,
  MenuItem
} from '@mui/material';

function Spayments() {
  const [supplies, setSupplies] = useState([]);
  const [supplierId, setSupplierId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);

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

  useEffect(() => {
    calculateTotals();
  }, [supplies, selectedMonth, selectedYear]);

  const calculateTotals = () => {
    let paid = 0;
    let pending = 0;
    let payment = 0;

    supplies.forEach((supply) => {
      if (
        (!selectedMonth || moment(supply.Date).format('MM') === selectedMonth) &&
        (!selectedYear || moment(supply.Date).format('YYYY') === selectedYear)
      ) {
        if (supply.Payment_Status === 0) {
          pending += parseFloat(supply.Total_Value);
        } else {
          paid += parseFloat(supply.Total_Value);
        }
        payment += parseFloat(supply.Total_Value);
      }
    });

    setTotalPaid(paid);
    setTotalPending(pending);
    setTotalPayment(payment);
  };

  // Extract unique years from supplies
  const years = Array.from(new Set(supplies.map(supply => moment(supply.Date).format('YYYY'))));

  return (
    <div>
      <SupplierBar />
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, width: '80%' }}>
        <TextField
          label="Select Month"
          variant="outlined"
          select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ marginRight: '10px', width:'10rem' }}
        >
          <MenuItem value="">All Months</MenuItem>
          {[...Array(12).keys()].map(month => (
            <MenuItem key={month + 1} value={(month + 1).toString().padStart(2, '0')}>
              {moment(`${month + 1}`, 'MM').format('MMMM')}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Select Year"
          variant="outlined"
          select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ marginRight: '10px', width:'10rem' }}
        >
          <MenuItem value="">All Years</MenuItem>
          {years.map(year => (
            <MenuItem key={year} value={year}>{year}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Card sx={{ width: '100%', maxWidth: 600, backgroundColor: '#DDD', paddingLeft: '2rem', mt: 3, margin: '0 auto' }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Payments</Typography>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <Typography sx={{ color: 'green' }}>
            Total Paid: <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{totalPaid}</span>
          </Typography>
          <Typography sx={{ color: 'red' }}>
            Total Pending: <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{totalPending}</span>
          </Typography>
          <Typography>
            Total Payment: <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{totalPayment}</span>
          </Typography>
        </div>
      </CardContent>
    </Card>


    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <TableContainer component={Paper} sx={{ mt: 3, width: '90%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Supply No</TableCell>
              <TableCell>Spice Type</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Total Value (LKR)</TableCell>
              <TableCell>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supplies.map((supply) => {
              const supplyMonth = moment(supply.Date).format('MM');
              const supplyYear = moment(supply.Date).format('YYYY');

              if (
                (!selectedMonth || supplyMonth === selectedMonth) &&
                (!selectedYear || supplyYear === selectedYear)
              ) {
                return (
                  <TableRow key={supply.Supply_ID}>
                    <TableCell>{supply.Supply_ID}</TableCell>
                    <TableCell>
                      {supply.Spices.split(',').map((item, index) => {
                        const [name] = item.split(' - ');
                        return (
                          <div key={index}>{name}</div>
                        );
                      })}
                    </TableCell>
                    <TableCell>
                      {supply.Spices.split(',').map((item, index) => {
                        const [, qty] = item.split(' - ');
                        return (
                          <div key={index}>{qty}</div>
                        );
                      })}
                    </TableCell>
                    <TableCell>
                      {supply.Spices.split(',').map((item, index) => {
                        const [, , value] = item.split(' - ');
                        return (
                          <div key={index}>{value}</div>
                        );
                      })}
                    </TableCell>
                    <TableCell>{moment(supply.Date).format('MM/DD/YYYY')}</TableCell>
                    <TableCell>{supply.Total_Value}</TableCell>
                    <TableCell>{supply.Payment_Status === 0 ? 'Pending' : 'Paid'}</TableCell>
                  </TableRow>
                );
              } else {
                return null;
              }
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    </div>
  );
}

export default Spayments;

