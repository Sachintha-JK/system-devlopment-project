import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import axios from 'axios';

function SpicesList({ show, handleClose }) {
  const [spices, setSpices] = useState([]);

  const fetchSpices = async () => {
    try {
      const response = await axios.get('http://localhost:8081/check_stock');
      console.log('Spices data:', response.data);
      setSpices(response.data.spices);
    } catch (error) {
      console.error('Error fetching spices:', error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchSpices();
    }
  }, [show]);

  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>Spices List</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table aria-label="spices table">
            <TableHead>
              <TableRow>
                <TableCell>Spice Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock (kg)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {spices.map((spice) => (
                <TableRow key={spice.Spice_Name}>
                  <TableCell>{spice.Spice_Name}</TableCell>
                  <TableCell>{spice.Selling_Price}</TableCell>
                  <TableCell>{spice.Stock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SpicesList;
