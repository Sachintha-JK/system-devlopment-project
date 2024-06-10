import React, { useEffect, useState } from 'react';
import SupplierBar from '../../component/SupplierBar';
import axios from 'axios';
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

function PriceLevel() {
  const [spices, setSpices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/spices')
      .then(response => {
        setSpices(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <SupplierBar />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <TableContainer component={Paper} sx={{ width:700 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Spice ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Spice Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Price for 1 kg (Rs)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {spices.map(spice => (
                <TableRow key={spice.Spice_ID}>
                  <TableCell>{spice.Spice_ID}</TableCell>
                  <TableCell>{spice.Spice_Name}</TableCell>
                  <TableCell>{spice.Buying_Price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default PriceLevel;
