import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import { Box, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material'; // Import Button from Material-UI
import ProfileBar from '../../component/ProfileBar';
import AdminNBar from '../../component/AdminNBar'; // Adjust the path as needed
import AddSupplier from '../../component/AddSupplier';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false); // State to control modal visibility
  const [branchId, setBranchId] = useState(''); // Example branch ID
  const [userID, setUserID] = useState(''); // Example user ID

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

  // Callback to add new supplier
  const handleSaveSupplier = (newSupplier) => {
    setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
  };

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

        <Container className="mt-5">
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

          <Box sx={{ mb: 3, textAlign: 'left' }}> {/* Align to the left */}
            <Button variant="contained" color="primary" onClick={() => setShowAddModal(true)}>
              Add Supplier
            </Button>
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

      {/* Add Supplier Modal */}
      <AddSupplier
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onSave={handleSaveSupplier}
        branchId={branchId}
        userID={userID}
      />
    </div>
  );
}

export default Suppliers;
