import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Button,
  Checkbox,
  Modal,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import AddSupply from '../../component/AddSupply';
import BmNbar from '../../component/BmNbar';

function Supply() {
  const [supplyDetails, setSupplyDetails] = useState([]);
  const [spices, setSpices] = useState([]);
  const [showAddSupplyModal, setShowAddSupplyModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedSupplyId, setSelectedSupplyId] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchSupplyDetails = async () => {
    const User_ID = user.User_ID;
    try {
      const response = await axios.get(`http://localhost:8081/supply_details`);
      console.log(response);
      setSupplyDetails(response.data);
    } catch (error) {
      console.error('Error fetching supply details:', error);
    }
  };

  useEffect(() => {
    fetchSupplyDetails();
  }, []);

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
    setSelectedSupplyId(supplyId);
    setConfirmationModal(true);
  };

  const handleConfirmPayment = async () => {
    const updatedSupplyDetails = [...supplyDetails];
    const index = updatedSupplyDetails.findIndex(
      (detail) => detail.Supply_ID === selectedSupplyId
    );
    updatedSupplyDetails[index].Payment_Status = 1;
    updatedSupplyDetails[index].disabled = true;
    setSupplyDetails(updatedSupplyDetails);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user.User_ID : null;

      await axios.put(
        `http://localhost:8081/update_payment_status/${selectedSupplyId}`,
        {
          Payment_Status: 1,
          User_ID: userId,
        }
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
    }

    setConfirmationModal(false);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmationModal(false);
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

  const handleAddSupplyClick = () => {
    setShowAddSupplyModal(true);
  };

  const handleCloseAddSupplyModal = () => {
    setShowAddSupplyModal(false);
  };

  const handleAddSupply = (newSupply) => {
    setSupplyDetails([...supplyDetails, newSupply]);
    setShowAddSupplyModal(false);
  };

  const handleSupplyIdClick = (supplyId) => {
    setSelectedSupplyId(supplyId === selectedSupplyId ? null : supplyId);
  };

  return (
    <div>
      <BmNbar />
      <Container className="mt-5">
        <h1 style={{ textAlign: 'center' }}>Spice Collection Details</h1>
        <Button
          variant="contained"
          onClick={handleAddSupplyClick}
          style={{ marginBottom: '20px' }}
        >
          Add Supply
        </Button>
        <TableContainer component={Paper}>
          <Table sx={{ fontSize: '1.2rem' }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Supplier Name</b>
                </TableCell>
                <TableCell>
                  <b>Contact Number</b>
                </TableCell>
                <TableCell>
                  <b>Branch</b>
                </TableCell>
                <TableCell>
                  <b>Date</b>
                </TableCell>
                <TableCell>
                  <b>Spice Name</b>
                </TableCell>
                <TableCell>
                  <b>Quantity</b>
                </TableCell>
                <TableCell>
                  <b>Value</b>
                </TableCell>
                <TableCell>
                  <b>Payment</b>
                </TableCell>
                <TableCell>
                  <b>Payment Status</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {supplyDetails.map((detail, index) => (
                <React.Fragment key={detail.Supply_ID}>
                  <TableRow>
                    <TableCell
                      onClick={() => handleSupplyIdClick(detail.Supply_ID)}
                      style={{ cursor: 'pointer' }}
                    >
                      {detail.Supply_ID}
                    </TableCell>
                    <TableCell>{detail.Supplier_Name}</TableCell>
                    <TableCell>{detail.Contact_Number}</TableCell>
                    <TableCell>{detail.Branch_Name}</TableCell>
                    <TableCell>
                      {new Date(detail.Supply_Date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{detail.Spice_Name}</TableCell>
                    <TableCell>{detail.Quantity}</TableCell>
                    <TableCell>{detail.Value}</TableCell>
                    <TableCell>{detail.Payment}</TableCell>
                    <TableCell>
                      <Checkbox
                        disabled={detail.disabled}
                        checked={detail.Payment_Status === 1}
                        onClick={() => handleCheckboxClick(index, detail.Supply_ID)}
                      />
                    </TableCell>
                  </TableRow>
                  {selectedSupplyId === detail.Supply_ID && (
                    <TableRow>
                      <TableCell colSpan={12}>
                        <strong>Additional Details:</strong>{' '}
                        {detail.Other_Details}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* AddSupply Modal */}
        <Modal open={showAddSupplyModal} onClose={handleCloseAddSupplyModal}>
          <AddSupply onAddSupply={handleAddSupply} />
        </Modal>

        {/* Confirmation Modal */}
        <Modal
          open={confirmationModal}
          onClose={handleCloseConfirmationModal}
        >
          <div style={{ backgroundColor: 'white', padding: '20px' }}>
            <h2>Confirm Payment</h2>
            <p>Are you sure you want to mark this supply as paid?</p>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmPayment}
              style={{ marginRight: '10px' }}
            >
              Confirm
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseConfirmationModal}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </Container>
    </div>
  );
}

export default Supply;
