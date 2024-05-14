import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/Register.css';

function SupRegister() {
    
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [village, setVillage] = useState('');
    const [city, setCity] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [branch, setBranch] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();


        // Form validation: Check if any field is blank
        if (!userName || !password || !name || !village || !city || !contactNumber || !branch) {
            toast.error("Please fill in all fields."); // Display error notification
            return; // Exit function if any field is blank
        }


        try {
            // Send a POST request to create a new user
            const userResponse = await axios.post('http://localhost:8081/user', {
                User_Name: userName,
                User_Type: 'Supplier',
                Password: password,
            });

            // Extract the User_ID from the response
            const userId = userResponse.data.User_ID;

            // Send a POST request to create a new supplier, with the retrieved User_ID
            const supplierResponse = await axios.post('http://localhost:8081/supplier', {
                Name: name,
                Address1: village,
                Address2: city,
                Contact_Number: contactNumber,
                Branch_Name: branch,
                User_ID: userId
            });

            // Show success notification
            toast.success("Supplier registered successfully!");

            // Clear form fields
            clearForm();
        } catch (error) {
            // Show error notification
            toast.error("Error registering supplier. Please try again.");
            console.error('Error:', error.response.data);
        }
    };

    const clearForm = () => {
        setUserName('');
        setPassword('');
        setName('');
        setVillage('');
        setCity('');
        setContactNumber('');
        setBranch('');
    };

    return (
        <div>
            <br />
            <div style={{ textAlign: 'center' }}>
                <h1>Register Supplier</h1>
            </div>
            <br />
            <br />
            <div className="sup-register-form-container">
                <Form className="sup-register-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" id="formGridName">
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
                        <Form.Group as={Col} controlId="formGridAddress1">
                            <Form.Label>Village</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Katuwana"
                                value={village}
                                onChange={(e) => setVillage(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridAddress2">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Hambanthota"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3" id="formGridName">
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter the contact number"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" id="formGridName">
                        <Form.Label>Branch</Form.Label>
                        <Form.Control
                            type="Text"
                            placeholder="Enter the Branch Name"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default SupRegister;
