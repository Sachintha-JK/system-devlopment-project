import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/Register.css';

function ManagerRegister() {
    
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [branch, setBranch] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();


        // Form validation: Check if any field is blank
        if (!userName || !password || !name || !email || !contactNumber || !branch) {
            toast.error("Please fill in all fields."); // Display error notification
            return; // Exit function if any field is blank
        }


        try {
            // Send a POST request to create a new user
            const userResponse = await axios.post('http://localhost:8081/user', {
                User_Name: userName,
                User_Type: 'Branch Manager',
                Password: password,
            });

            // Extract the User_ID from the response
            const userId = userResponse.data.User_ID;

            // Send a POST request to create a new Branch Manager, with the retrieved User_ID
            const branch_managerResponse = await axios.post('http://localhost:8081/branch_manager', {
                Name: name,
                Contact_Number: contactNumber,
                Branch_Name: branch,
                User_ID: userId,
                Email: email
            });

            // Show success notification
            toast.success("Branch Manager registered successfully!");

            // Clear form fields
            clearForm();
        } catch (error) {
            // Show error notification
            toast.error("Error registering manager. Please try again.");
            console.error('Error:', error.response.data);
        }
    };

    const clearForm = () => {
        setUserName('');
        setPassword('');
        setName('');
        setContactNumber('');
        setBranch('');
        setEmail('');
    };

    return (
        <div>
            <br />
            <div style={{ textAlign: 'center' }}>
                <h1>Register-Branch Manager</h1>
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

export default ManagerRegister;
