import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Card, CardContent, CardHeader } from '@mui/material';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.Branch_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
      {/* Card for the heading */}
      <Card sx={{ mb: 3, boxShadow: 3, backgroundColor: '#f5f5f5' }}>
        <CardHeader
          title={
            <Typography variant="h4" component="h1" align="center">
              Suppliers
            </Typography>
          }
        />
      </Card>

      {/* Search bar outside the card */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search by supplier or branch"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '70%' }} // Adjust width as needed
        />
      </Box>

      {/* Table container */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#000' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontSize: '1.2rem' }}>Supplier ID</TableCell>
              <TableCell sx={{ color: '#fff', fontSize: '1.2rem' }}>Name</TableCell>
              <TableCell sx={{ color: '#fff', fontSize: '1.2rem' }}>Contact Number</TableCell>
              <TableCell sx={{ color: '#fff', fontSize: '1.2rem' }}>Address</TableCell>
              <TableCell sx={{ color: '#fff', fontSize: '1.2rem' }}>Branch Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.Supplier_ID}>
                <TableCell>{supplier.Supplier_ID}</TableCell>
                <TableCell>{supplier.Name}</TableCell>
                <TableCell>{supplier.Contact_Number}</TableCell>
                <TableCell>{`${supplier.Address1}, ${supplier.Address2}`}</TableCell>
                <TableCell>{supplier.Branch_Name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Suppliers;
