import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import BmNbar from '../../component/BmNbar';

function SpiceQuantities() {
  const [spiceQuantities, setSpiceQuantities] = useState([]);
  const [branchId, setBranchId] = useState(null);

  useEffect(() => {
    const fetchBranchManager = async () => {
      try {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
          throw new Error('User not found in local storage');
        }
        const user = JSON.parse(userJson);
        const userId = user.User_ID;

        const response = await axios.get(`http://localhost:8081/find_branch_manager/${userId}`);
        setBranchId(response.data.Branch_ID);
      } catch (error) {
        console.error('Error fetching branch manager:', error);
      }
    };

    fetchBranchManager();
  }, []);

  useEffect(() => {
    if (branchId) {
      const fetchSpiceQuantities = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/spice_quantities/${branchId}`);
          setSpiceQuantities(response.data);
        } catch (error) {
          console.error('Error fetching spice quantities:', error);
        }
      };

      fetchSpiceQuantities();
    }
  }, [branchId]);

  return (
    <div>
      <BmNbar />
      <Container sx={{ marginTop: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" gutterBottom>Spice Quantities</Typography>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650, fontSize: 16 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><strong>Spice ID</strong></TableCell>
                    <TableCell align="center"><strong>Spice Name</strong></TableCell>
                    <TableCell align="center"><strong>Total Quantity (kg)</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {spiceQuantities.map((spice) => (
                    <TableRow key={spice.Spice_ID}>
                      <TableCell align="center">{spice.Spice_ID}</TableCell>
                      <TableCell align="center">{spice.Spice_Name}</TableCell>
                      <TableCell align="center">{spice.Total_Quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}

export default SpiceQuantities;
