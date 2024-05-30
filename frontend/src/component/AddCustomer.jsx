import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddCustomer({ handleClose }) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Form validation: Check if any field is blank
        if (!userName || !password || !name || !email || !contactNumber || !companyName) {
            toast.error("Please fill in all fields."); // Display error notification
            return; // Exit function if any field is blank
        }

        try {
            // Send a POST request to create a new user
            const userResponse = await axios.post('http://localhost:8081/user', {
                User_Name: userName,
                User_Type: 'Customer',
                Password: password,
            });

            // Extract the User_ID from the response
            const userId = userResponse.data.User_ID;

            // Send a POST request to create a new Customer, with the retrieved User_ID
            const customerResponse = await axios.post('http://localhost:8081/customer', {
                Name: name,
                Contact_Number: contactNumber,
                Email: email,
                User_ID: userId,
                Company_Name: companyName
            });

            // Show success notification
            toast.success("Customer registered successfully!");

            // Clear form fields
            clearForm();

            // Close the modal
            handleClose();
        } catch (error) {
            // Show error notification
            toast.error("Error registering Customer. Please try again.");
            console.error('Error:', error.response.data);
        }
    };

    const clearForm = () => {
        setUserName('');
        setPassword('');
        setName('');
        setContactNumber('');
        setEmail('');
        setCompanyName('');
    };

    return (
        <Modal show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Register Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGridName">
                        <Form.Label>Company Name</Form.Label>
                        <Form.Control
                            type="Text"
                            placeholder="Enter the Company Name"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name with surname"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridUserName">
                            <Form.Label>UserName</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter UserName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridCnumberr">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the contact number"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridemail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                    </Row>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Modal.Body>
            <ToastContainer />
        </Modal>
    );
}

export default AddCustomer;
