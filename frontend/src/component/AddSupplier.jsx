import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function AddSupplier({ show, handleClose, onSave, branchId, userID }) { // Include the userID prop
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleSave = async () => {
    try {
      const newSupplier = {
        Name: name,
        Contact_Number: contactNumber,
        Address1: address1,
        Address2: address2,
        Branch_ID: branchId,
        User_Name: userName,
        User_Type: 'Supplier', // User type is always 'Supplier'
        Password: password,
        A_User_ID: userID, // Use the userID prop
      };
      console.log('New Supplier Data:', newSupplier); // Log new supplier data

      const response = await axios.post('http://localhost:8081/suppliers', newSupplier);
      console.log('Supplier Save Response:', response.data); // Log response from backend
      onSave(response.data);
      handleClose();
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formAddress1">
            <Form.Label>Address 1</Form.Label>
            <Form.Control type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formAddress2">
            <Form.Label>Address 2</Form.Label>
            <Form.Control type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formUserName">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>
          Register Supplier
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddSupplier;
