import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container } from 'react-bootstrap';

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
    <Container className="mt-5">
      <h1>Spice Quantities</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Spice ID</th>
            <th>Spice Name</th>
            <th>Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          {spiceQuantities.map((spice) => (
            <tr key={spice.Spice_ID}>
              <td>{spice.Spice_ID}</td>
              <td>{spice.Spice_Name}</td>
              <td>{spice.Total_Quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default SpiceQuantities;
