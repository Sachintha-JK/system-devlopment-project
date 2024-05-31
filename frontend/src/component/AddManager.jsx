import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ManagerRegister() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [branchId, setBranchId] = useState('');
    const [email, setEmail] = useState('');
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        // Fetch branches from the backend
        const fetchBranches = async () => {
            try {
                const response = await axios.get('http://localhost:8081/branches');
                setBranches(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
                toast.error("Error fetching branches. Please try again later.");
            }
        };

        fetchBranches();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!userName || !password || !name || !email || !contactNumber || !branchId) {
            toast.error("Please fill in all fields.");
            return;
        }
    
        console.log("Submitting form with data:", {
            userName,
            password,
            name,
            email,
            contactNumber,
            branchId
        });
    
        try {
            const userResponse = await axios.post('http://localhost:8081/user', {
                User_Name: userName,
                User_Type: 'Branch Manager',
                Password: password,
            });
    
            const userId = userResponse.data.User_ID;
            console.log("User created with ID:", userId);
    
            console.log("Submitting branch manager data:", {
                Name: name,
                Contact_Number: contactNumber,
                Branch_ID: branchId,
                User_ID: userId,
                Email: email
            });
    
            const branchManagerResponse = await axios.post('http://localhost:8081/branch_manager', {
                Name: name,
                Contact_Number: contactNumber,
                Branch_ID: branchId,
                User_ID: userId,
                Email: email
            });
    
            console.log("Branch manager response:", branchManagerResponse.data);
            toast.success("Branch Manager registered successfully!");
            clearForm();
        } catch (error) {
            toast.error("Error registering manager. Please try again.");
            console.error('Error:', error);
        }
    };
    

    const clearForm = () => {
        setUserName('');
        setPassword('');
        setName('');
        setContactNumber('');
        setBranchId('');
        setEmail('');
    };

    return (
        <div>
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
                        <Form.Group as={Col} controlId="formGridCnumber">
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the contact number"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-3" id="formGridBranch">
                        <Form.Label>Branch</Form.Label>
                        <Form.Control
                            as="select"
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                        >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                                <option key={branch.Branch_ID} value={branch.Branch_ID}>
                                    {branch.Branch_Name}
                                </option>
                            ))}
                        </Form.Control>
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
