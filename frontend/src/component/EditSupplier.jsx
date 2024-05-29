// EditSupplier.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function EditSupplier({ show, handleClose, supplier, onSave }) {
  const [name, setName] = useState(supplier.Name);
  const [contactNumber, setContactNumber] = useState(supplier.Contact_Number);
  const [address1, setAddress1] = useState(supplier.Address1);
  const [address2, setAddress2] = useState(supplier.Address2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedSupplier = {
        ...supplier,
        Name: name,
        Contact_Number: contactNumber,
        Address1: address1,
        Address2: address2,
      };
      await axios.put(`http://localhost:8081/suppliers/${supplier.Supplier_ID}`, updatedSupplier);
      onSave(updatedSupplier);
      handleClose();
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Supplier</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formAddress1">
            <Form.Label>Address 1</Form.Label>
            <Form.Control
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formAddress2">
            <Form.Label>Address 2</Form.Label>
            <Form.Control
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditSupplier;
