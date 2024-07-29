import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import ProfileBar from '../../component/ProfileBar';
import AdminNBar from '../../component/AdminNBar';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function SpaymentView() {
  const [supplyDetails, setSupplyDetails] = useState([]);

  useEffect(() => {
    fetchSupplyDetails();
  }, []);

  const fetchSupplyDetails = async () => {
    try {
      const response = await axios.get('http://localhost:8081/supply_details');
      console.log('Response status:', response.status); // Log the response status
      console.log('Response data:', response.data); // Log the response data
      setSupplyDetails(response.data);
    } catch (error) {
      console.error('Error fetching supply details:', error);
    }
  };

  return (
    <div>
      <ProfileBar pageName="Collection Details" />

      <div style={{ display: 'flex' }}>
        <div><AdminNBar /></div>
        <div style={{ flexGrow: 1 }}></div>
        <Box sx={{ marginLeft: '0px', marginTop:'20px', width: '100%' }}>
          

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#000' }}>
                <TableRow>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Supply ID</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Supplier Name</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Supply Date</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Payment</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Spice ID</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Quantity</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Value</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1rem' }}>Payment Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {supplyDetails.map((supply) => (
                  <TableRow key={supply.Supply_ID}>
                    <TableCell sx={{ fontSize: '1rem' }}>{supply.Supply_ID}</TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>{supply.Supplier_Name}</TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>{moment(supply.Supply_Date).format('YYYY-MM-DD')}</TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>{supply.Payment}</TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>{supply.Spice_ID}</TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>{supply.Quantity}</TableCell>
                    <TableCell sx={{ fontSize: '1rem' }}>{supply.Value}</TableCell>
                    <TableCell
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 'bold', // Bold the text for visibility
                        textAlign: 'center', // Center the text
                        color: supply.Payment_Status === 1 ? 'green' : 'blue', // Conditional text color
                      }}
                    >
                      {supply.Payment_Status === 1 ? 'Paid' : 'Pending'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    </div>
  );
}

export default SpaymentView;
