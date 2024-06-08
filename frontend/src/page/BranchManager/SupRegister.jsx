import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Modal, 
  Typography 
} from '@mui/material';
import AddSupplier from '../../component/AddSupplier'; // Adjust the import path as needed
import EditSupplier from '../../component/EditSupplier'; // Import the EditSupplier component
import BmNbar from '../../component/BmNbar';

function ViewSupplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [branchManager, setBranchManager] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const fetchBranchManagerAndSuppliers = async () => {
      try {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
          throw new Error('User not found in local storage');
        }
        const user = JSON.parse(userJson);
        const userId = user.User_ID;
        setUserID(userId); // Set the userID state variable

        const response = await axios.get(`http://localhost:8081/find_branch_manager/${userId}`);
        setBranchManager(response.data);

        const branchId = response.data.Branch_ID;
        const suppliersResponse = await axios.get(`http://localhost:8081/suppliers/${branchId}`);
        setSuppliers(suppliersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // You may want to handle errors more gracefully, maybe display a message to the user
      }
    };
    fetchBranchManagerAndSuppliers();
  }, []);

  const handleAddSupplier = (newSupplier) => {
    setSuppliers([...suppliers, newSupplier]);
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setShowEditModal(true);
  };

  const handleEditSave = (updatedSupplier) => {
    setSuppliers(suppliers.map((s) =>
      s.Supplier_ID === updatedSupplier.Supplier_ID ? updatedSupplier : s
    ));
  };

  const handleDeactivate = async (supplier) => {
    try {
      await axios.put(`http://localhost:8081/deactivate_supplier/${supplier.Supplier_ID}`);
      const updatedSuppliers = suppliers.filter((s) => s.Supplier_ID !== supplier.Supplier_ID);
      setSuppliers(updatedSuppliers);
    } catch (error) {
      console.error('Error deactivating supplier:', error);
      // You may want to handle errors more gracefully, maybe display a message to the user
    }
  };

  const confirmDeactivate = (supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteModal(true);
  };

  const cancelDeactivate = () => {
    setShowDeleteModal(false);
    setSupplierToDelete(null);
  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
       <BmNbar />
      <div style={{ padding: '20px' }}>
        <Typography variant="h4">Registered Suppliers</Typography>
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by supplier name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '5px', marginRight: '10px' }}
          />
          <Button variant="contained" color="primary" onClick={() => setShowAddModal(true)}>
            Add Supplier
          </Button>
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6" fontWeight="bold">ID</Typography></TableCell>
                <TableCell><Typography variant="h6" fontWeight="bold">Name</Typography></TableCell>
                <TableCell><Typography variant="h6" fontWeight="bold">Contact Number</Typography></TableCell>
                <TableCell><Typography variant="h6" fontWeight="bold">Address</Typography></TableCell>
                <TableCell><Typography variant="h6" fontWeight="bold">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.map((supplier) => (
                <TableRow key={supplier.Supplier_ID}>
                  <TableCell>{supplier.Supplier_ID}</TableCell>
                  <TableCell>{supplier.Name}</TableCell>
                  <TableCell>{supplier.Contact_Number}</TableCell>
                  <TableCell>{`${supplier.Address1}, ${supplier.Address2}`}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="success" onClick={() => handleEdit(supplier)}>
                      Edit
                    </Button>
                    <Button variant="contained" color="error" onClick={() => confirmDeactivate(supplier)}>
                      Deactivate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {branchManager && (
        <AddSupplier
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          onSave={handleAddSupplier}
          branchId={branchManager.Branch_ID}
          userID={userID} // Pass the userID prop
        />
      )}
      {selectedSupplier && (
        <EditSupplier
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          supplier={selectedSupplier}
          onSave={handleEditSave}
        />
      )}
      <Modal open={showDeleteModal} onClose={cancelDeactivate}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px' }}>
          <Typography variant="h6">Confirm Deactivation</Typography>
          <Typography>Are you sure you want to deactivate this supplier?</Typography>
          <div style={{ marginTop: '20px' }}>
            <Button variant="contained" onClick={cancelDeactivate}>Cancel</Button>
            <Button variant="contained" color="error" onClick={() => {
              handleDeactivate(supplierToDelete);
              cancelDeactivate(); // Closing modal after deactivation
            }}>Deactivate</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ViewSupplier;
