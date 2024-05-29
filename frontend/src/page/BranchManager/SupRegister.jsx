import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import AddSupplier from '../../component/AddSupplier'; // Adjust the import path as needed
import EditSupplier from '../../component/EditSupplier'; // Import the EditSupplier component

function ViewSupplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [branchManager, setBranchManager] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBranchManagerAndSuppliers = async () => {
      try {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
          throw new Error('User not found in local storage');
        }
        const user = JSON.parse(userJson);
        const userId = user.User_ID;

        const response = await axios.get(`http://localhost:8081/find_branch_manager/${userId}`);
        setBranchManager(response.data);

        const branchId = response.data.Branch_ID;
        const suppliersResponse = await axios.get(`http://localhost:8081/suppliers/${branchId}`);
        setSuppliers(suppliersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    setSuppliers(suppliers.map((supplier) =>
      supplier.Supplier_ID === updatedSupplier.Supplier_ID ? updatedSupplier : supplier
    ));
  };

  const handleDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8081/suppliers/${supplierToDelete.Supplier_ID}`);
      setSuppliers(suppliers.filter((supplier) => supplier.Supplier_ID !== supplierToDelete.Supplier_ID));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSupplierToDelete(null);
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Container className="mt-5">
        <Row>
          <Col>
            <h1>Registered Suppliers</h1>
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Search by supplier name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Supplier</Button>
        <br />
        <br />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.Supplier_ID}>
                <td>{supplier.Supplier_ID}</td>
                <td>{supplier.Name}</td>
                <td>{supplier.Contact_Number}</td>
                <td>{`${supplier.Address1}, ${supplier.Address2}`}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEdit(supplier)}>Edit</Button>{' '}
                  <Button variant="danger" onClick={() => handleDelete(supplier)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      {branchManager && (
        <AddSupplier
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
          onSave={handleAddSupplier}
          branchId={branchManager.Branch_ID}
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
      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this supplier?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ViewSupplier;
