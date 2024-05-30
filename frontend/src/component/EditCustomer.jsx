import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

function EditCustomerForm({ customer, handleClose }) {
  const [name, setName] = useState(customer.Name);
  const [contactNumber, setContactNumber] = useState(customer.Contact_Number);
  const [email, setEmail] = useState(customer.Email);
  const [companyName, setCompanyName] = useState(customer.Company_Name);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make API call to update customer data
      const response = await axios.put(`http://localhost:8081/updatecustomer/${customer.Customer_ID}`, {
        Name: name,
        Company_Name: companyName,
        Contact_Number: contactNumber,
        Email: email,
      });

      // Check if the update was successful
      if (response.status === 200) {
        // If successful, close the modal
        handleClose();
      } else {
        // Handle error if update was not successful
        console.error('Failed to update customer data');
        // Optionally, you can show an error message to the user
      }
    } catch (error) {
      // Handle any errors from the API call
      console.error('Error updating customer data:', error);
      // Optionally, you can show an error message to the user
    }
  };

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name with surname"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCompanyName">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="Text"
              placeholder="Enter the Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
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

export default EditCustomerForm;
