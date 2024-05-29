import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button } from 'react-bootstrap';

function Supply() {
  const [supplyDetails, setSupplyDetails] = useState([]);
  const [spices, setSpices] = useState([]);
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
      const fetchSupplyDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8081/supply_details/${branchId}`);
          setSupplyDetails(response.data);
        } catch (error) {
          console.error('Error fetching supply details:', error);
        }
      };

      fetchSupplyDetails();
    }
  }, [branchId]);

  useEffect(() => {
    const fetchSpices = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/spice`);
        setSpices(response.data);
      } catch (error) {
        console.error('Error fetching spices:', error);
      }
    };

    fetchSpices();
  }, []);

  const handleCheckboxClick = async (index, supplyId) => {
    const updatedSupplyDetails = [...supplyDetails];
    updatedSupplyDetails[index].Payment_Status = 1;
    updatedSupplyDetails[index].disabled = true;
    setSupplyDetails(updatedSupplyDetails);

    try {
      await axios.put(`http://localhost:8081/update_payment_status/${supplyId}`, {
        Payment_Status: 1 // Assuming 1 means paid
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleEditClick = async (index, supplyId) => {
    const updatedSupplyDetails = [...supplyDetails];
    updatedSupplyDetails[index].Payment_Status = 0;
    updatedSupplyDetails[index].disabled = false;
    setSupplyDetails(updatedSupplyDetails);

    try {
      await axios.put(`http://localhost:8081/reset_payment_status/${supplyId}`);
    } catch (error) {
      console.error('Error resetting payment status:', error);
    }
  };

  const handleDeleteClick = async (index, supplyId) => {
    try {
      await axios.delete(`http://localhost:8081/delete_supply/${supplyId}`);
      const updatedSupplyDetails = supplyDetails.filter((_, i) => i !== index);
      setSupplyDetails(updatedSupplyDetails);
    } catch (error) {
      console.error('Error deleting supply:', error);
    }
  };

  return (
    <Container className="mt-5">
      <h1>Supply Details</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Supply ID</th>
            <th>Supplier ID</th>
            <th>Date</th>
            <th>Spice Name</th>
            <th>Quantity</th>
            <th>Value</th>
            <th>Payment</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {supplyDetails.map((detail, index) => (
            <tr key={detail.Supply_ID}>
              <td>{detail.Supply_ID}</td>
              <td>{detail.Supplier_ID}</td>
              <td>{detail.Date}</td>
              <td>{spices.find(spice => spice.Spice_Id === detail.Spice_ID)?.Spice_Name}</td>
              <td>{detail.Quantity}</td>
              <td>{detail.Value}</td>
              <td>{detail.Payment}</td>
              <td>
                <input
                  type="checkbox"
                  disabled={detail.disabled}
                  checked={detail.Payment_Status === 1}
                  onClick={() => handleCheckboxClick(index, detail.Supply_ID)}
                />
              </td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => handleEditClick(index, detail.Supply_ID)}
                  disabled={!detail.disabled}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteClick(index, detail.Supply_ID)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default Supply;
