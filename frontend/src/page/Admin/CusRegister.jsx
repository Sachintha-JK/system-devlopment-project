import React, { useState, useEffect } from 'react';
import { Button, Container, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import AddCustomer from '../../component/AddCustomer';
import EditCustomer from '../../component/EditCustomer';
import ProfileBar from '../../component/ProfileBar';
import AdminNBar from '../../component/AdminNBar';
import axios from 'axios';

function CusRegister() {
  const [showPopup, setShowPopup] = useState(false); // Manage AddCustomer popup visibility
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => { 
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/customers');
        setCustomers(response.data);
        setFilteredCustomers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Error fetching customers. Please try again later.');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleToggleStatus = async (customer) => {
    const newStatus = customer.Active_Status === 1 ? 0 : 1;
    const action = newStatus === 1 ? 'activate' : 'deactivate';

    try {
      const response = await axios.put(`http://localhost:8081/${action}customer/${customer.Customer_ID}`, {
        Active_Status: newStatus,
      });

      if (response.status === 200) {
        // Update the local state with the updated customer status
        setCustomers(prevCustomers =>
          prevCustomers.map(c =>
            c.Customer_ID === customer.Customer_ID ? { ...c, Active_Status: newStatus } : c
          )
        );
        // Update the filtered list as well
        filterCustomers(searchTerm);
      }
    } catch (error) {
      console.error(`Error ${action} customer:`, error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterCustomers(event.target.value);
  };

  const filterCustomers = (searchTerm) => {
    const filtered = customers.filter((customer) =>
      customer.Company_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <div><ProfileBar pageName="Customer" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminNBar /></div>
        <div style={{ flexGrow: 1 }}></div>
        <Container>
          <br/>
          <TextField
            label="Search by Company Name"
            size="small"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />
         {/*ADD CUSTOMER component is called */}
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setShowPopup(true)}
            style={{ marginBottom: '20px' }}
          >
            Add Customer
          </Button>
          

          {/*Customer details are shown */}

          {error && <p className="text-danger">{error}</p>}

          {!loading && !error && (
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer ID</TableCell>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Contact Number</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>


                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.Customer_ID}>
                      <TableCell>{customer.Customer_ID}</TableCell>
                      <TableCell>{customer.Company_Name}</TableCell>
                      <TableCell>{customer.Contact_Number}</TableCell>
                      <TableCell>{customer.Email}</TableCell>
                      <TableCell>

                         {/*Call the EDIT component */}

                        <Button variant="contained" color="primary" onClick={() => handleEdit(customer)}>Edit</Button>
                        
                           {/*Call the DEACTIVATE component */}

                        <Button
                          variant={customer.Active_Status === 1 ? "contained" : "outlined"}
                          color={customer.Active_Status === 1 ? "secondary" : "primary"}
                          style={{ marginLeft: '5px' }}
                          onClick={() => handleToggleStatus(customer)}
                        >
                          {customer.Active_Status === 1 ? "Deactivate" : "Activate"}
                        </Button>


                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {showPopup && <AddCustomer handleClose={handleClose} />}
          {showEditModal && <EditCustomer customer={selectedCustomer} handleClose={handleCloseEditModal} />}
        </Container>
      </div>
    </div>
  );
}

export default CusRegister;
