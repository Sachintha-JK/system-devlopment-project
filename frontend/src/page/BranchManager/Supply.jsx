import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Container, Button, Modal } from 'react-bootstrap';
import AddSupply from '../../component/AddSupply';
import BmNbar from '../../component/BmNbar';

function Supply() {
  const [supplyDetails, setSupplyDetails] = useState([]);
  const [spices, setSpices] = useState([]);
  const [showAddSupplyModal, setShowAddSupplyModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedSupplyId, setSelectedSupplyId] = useState(null);

  useEffect(() => {
    const fetchSupplyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/supply_details`);
        setSupplyDetails(response.data);
      } catch (error) {
        console.error('Error fetching supply details:', error);
      }
    };

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
    const index = updatedSupplyDetails.findIndex(detail => detail.Supply_ID === selectedSupplyId);
    updatedSupplyDetails[index].Payment_Status = 1;
    updatedSupplyDetails[index].disabled = true;
    setSupplyDetails(updatedSupplyDetails);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user.User_ID : null;

      await axios.put(`http://localhost:8081/update_payment_status/${selectedSupplyId}`, {
        Payment_Status: 1,
        User_ID: userId
      });
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
       <div>  <BmNbar /></div>
   
    <Container className="mt-5">
      
      <h1>Spice Collection Details</h1>
      <Button variant="primary" onClick={handleAddSupplyClick} className="mb-3">
        Add Supply
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Supplier Name</th>
            <th>Contact Number</th>
            <th>Date</th>
            <th>Spice Name</th>
            <th>Quantity</th>
            <th>Value</th>
            <th>Payment</th>
            <th>Payment Status</th>
           
          </tr>
        </thead>
        <tbody>
          {supplyDetails.map((detail, index) => (
            <React.Fragment key={detail.Supply_ID}>
              <tr>
                <td onClick={() => handleSupplyIdClick(detail.Supply_ID)} style={{ cursor: 'pointer' }}>
                  {detail.Supply_ID}
                </td>
                <td>{detail.Supplier_Name}</td>
                <td>{detail.Contact_Number}</td>
                <td>{new Date(detail.Supply_Date).toLocaleDateString()}</td>
                <td>{detail.Spice_Name}</td>
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
               
              </tr>
              {selectedSupplyId === detail.Supply_ID && (
                <tr>
                  <td colSpan="10">
                    <strong>Added By:</strong> {detail.A_User_ID}, 
                    <br/>
                    <strong>Paid By:</strong> {detail.P_User_ID}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      {/* AddSupply Modal */}
      <Modal show={showAddSupplyModal} onHide={handleCloseAddSupplyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Supply</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddSupply onAddSupply={handleAddSupply} />
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={confirmationModal} onHide={handleCloseConfirmationModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark this supply as paid?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmationModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmPayment}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </div>
  );
}

export default Supply;
