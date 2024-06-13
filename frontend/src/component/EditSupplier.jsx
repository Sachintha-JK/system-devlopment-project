import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function EditSupplier({ show, handleClose, supplier, onSave }) {
  const [name, setName] = useState(supplier.Name);
  const [contactNumber, setContactNumber] = useState(supplier.Contact_Number);
  const [address1, setAddress1] = useState(supplier.Address1);
  const [address2, setAddress2] = useState(supplier.Address2);
  const [errors, setErrors] = useState({
    name: '',
    contactNumber: '',
    address1: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      contactNumber: '',
      address1: ''
    };

    if (!name.trim()) {
      newErrors.name = 'Name cannot be empty.';
      isValid = false;
    } else if (!/^[a-zA-Z ]{1,50}$/.test(name)) {
      newErrors.name = 'Name must be alphabets and up to 50 characters.';
      isValid = false;
    }

    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number cannot be empty.';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(contactNumber)) {
      newErrors.contactNumber = 'Contact number must be 10 digits and start with 0.';
      isValid = false;
    }

    if (address1.length > 50) {
      newErrors.address1 = 'Address line 1 cannot exceed 50 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

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
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              isInvalid={!!errors.contactNumber}
            />
            <Form.Control.Feedback type="invalid">{errors.contactNumber}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formAddress1">
            <Form.Label>Address 1</Form.Label>
            <Form.Control
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              required
              isInvalid={!!errors.address1}
            />
            <Form.Control.Feedback type="invalid">{errors.address1}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formAddress2">
            <Form.Label>Address 2</Form.Label>
            <Form.Control
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
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
