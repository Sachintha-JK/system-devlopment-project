import React, { useState, useEffect } from 'react';
import { Button, Container, TextField, Grid, Select, MenuItem, Typography, Card, CardContent } from '@mui/material';
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
        <Container>
            <Card variant="outlined" style={{ marginBottom: '10px' }}>
                <CardContent>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Manager Registration
                    </Typography>
                </CardContent>
            </Card>

            <div>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="UserName"
                            fullWidth
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Password"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Contact Number"
                            fullWidth
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Select
                            label="Branch"
                            fullWidth
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                        >
                            <MenuItem value="">Select Branch</MenuItem>
                            {branches.map(branch => (
                                <MenuItem key={branch.Branch_ID} value={branch.Branch_ID}>
                                    {branch.Branch_Name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </div>
            <ToastContainer />
        </Container>
    );
}

export default ManagerRegister;
