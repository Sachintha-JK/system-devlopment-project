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

    const [errors, setErrors] = useState({});

    useEffect(() => {
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

    const validate = () => {
        let tempErrors = {};
        let isValid = true;

        if (!userName.trim()) {
            tempErrors.userName = "UserName is required.";
            isValid = false;
        } else if (userName.length > 20) {
            tempErrors.userName = "UserName must be at most 20 characters long.";
            isValid = false;
        }

        if (!password) {
            tempErrors.password = "Password is required.";
            isValid = false;
        } else if (password.length < 8 || password.length > 12) {
            tempErrors.password = "Password must be between 8 and 12 characters long.";
            isValid = false;
        }

        if (!name.trim()) {
            tempErrors.name = "Name is required.";
            isValid = false;
        } else if (name.length > 60) {
            tempErrors.name = "Name must be at most 60 characters long.";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            tempErrors.email = "Email is required.";
            isValid = false;
        } else if (!emailRegex.test(email)) {
            tempErrors.email = "Email is not valid.";
            isValid = false;
        } else if (email.length > 50) {
            tempErrors.email = "Email must be at most 50 characters long.";
            isValid = false;
        }

        const contactRegex = /^0\d{9}$/;
        if (!contactNumber) {
            tempErrors.contactNumber = "Contact Number is required.";
            isValid = false;
        } else if (!contactRegex.test(contactNumber)) {
            tempErrors.contactNumber = "Contact Number must start with '0' and be 10 digits long.";
            isValid = false;
        }

        if (!branchId) {
            tempErrors.branchId = "Branch is required.";
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        try {
            const userResponse = await axios.post('http://localhost:8081/user', {
                User_Name: userName,
                User_Type: 'Branch Manager',
                Password: password,
            });

            const userId = userResponse.data.User_ID;

            await axios.post('http://localhost:8081/branch_manager', {
                Name: name,
                Contact_Number: contactNumber,
                Branch_ID: branchId,
                User_ID: userId,
                Email: email
            });

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
        setErrors({});
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
                            error={!!errors.name}
                            helperText={errors.name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="UserName"
                            fullWidth
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            error={!!errors.userName}
                            helperText={errors.userName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Password"
                            fullWidth
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Contact Number"
                            fullWidth
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            error={!!errors.contactNumber}
                            helperText={errors.contactNumber}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Select
                            label="Branch"
                            fullWidth
                            value={branchId}
                            onChange={(e) => setBranchId(e.target.value)}
                            error={!!errors.branchId}
                            displayEmpty
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
