import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function AddSupplier({ show, handleClose, onSave, branchId, userID }) {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    contactNumber: '',
    address1: '',
    address2: '',
    userName: '',
    password: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: '',
      contactNumber: '',
      address1: '',
      address2: '',
      userName: '',
      password: ''
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

    if (!address1.trim() && !address2.trim()) {
      newErrors.address1 = 'Address line 1 or Address line 2 is required.';
      newErrors.address2 = 'Address line 1 or Address line 2 is required.';
      isValid = false;
    } else if (address1.length > 50) {
      newErrors.address1 = 'Address line 1 cannot exceed 50 characters.';
      isValid = false;
    } else if (address2.length > 50) {
      newErrors.address2 = 'Address line 2 cannot exceed 50 characters.';
      isValid = false;
    }

    if (!userName.trim()) {
      newErrors.userName = 'Username cannot be empty.';
      isValid = false;
    } else if (userName.length > 15) {
      newErrors.userName = 'Username cannot exceed 15 characters.';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password cannot be empty.';
      isValid = false;
    } else if (password.length < 8 || password.length > 12) {
      newErrors.password = 'Password must be between 8 and 12 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const newSupplier = {
        Name: name,
        Contact_Number: contactNumber,
        Address1: address1,
        Address2: address2,
        Branch_ID: branchId,
        User_Name: userName,
        User_Type: 'Supplier',
        Password: password,
        A_User_ID: userID,
      };

      const response = await axios.post('http://localhost:8081/suppliers', newSupplier);
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
            <Form.Text className="text-danger">{errors.name}</Form.Text>
          </Form.Group>
          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            <Form.Text className="text-danger">{errors.contactNumber}</Form.Text>
          </Form.Group>
          <Form.Group controlId="formAddress1">
            <Form.Label>Address 1</Form.Label>
            <Form.Control type="text" value={address1} onChange={(e) => setAddress1(e.target.value)} />
            <Form.Text className="text-danger">{errors.address1}</Form.Text>
          </Form.Group>
          <Form.Group controlId="formAddress2">
            <Form.Label>Address 2</Form.Label>
            <Form.Control type="text" value={address2} onChange={(e) => setAddress2(e.target.value)} />
            <Form.Text className="text-danger">{errors.address2}</Form.Text>
          </Form.Group>
          <Form.Group controlId="formUserName">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <Form.Text className="text-danger">{errors.userName}</Form.Text>
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Form.Text className="text-danger">{errors.password}</Form.Text>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Register Supplier
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddSupplier;
