import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Card, CardContent, CardHeader } from '@mui/material';
// Import the components
import ProfileBar from '../../component/ProfileBar';
import AdminNBar from '../../component/AdminNBar'; // Adjust the path as needed

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
    <div>
      <div><ProfileBar pageName="Supplier" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminNBar /></div>
        <div style={{ flexGrow: 1 }}></div>

        
         <Container class="mt-5">
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
          </Container>
        </div>
      </div>
   
  );
}

export default Suppliers;
