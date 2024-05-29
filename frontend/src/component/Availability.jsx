import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import axios from 'axios';

function SpicesList({ show, handleClose }) {
  const [spices, setSpices] = useState([]);

  const fetchSpices = async () => {
    try {
      const response = await axios.get('http://localhost:8081/check_stock');
      console.log('Spices data:', response.data);
      setSpices(response.data.spices);
    } catch (error) {
      console.error('Error fetching spices:', error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchSpices();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Spices List</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Spice Name</th>
              <th>Price</th>
              <th>Stock (kg)</th>
            </tr>
          </thead>
          <tbody>
            {spices.map((spice) => (
              <tr key={spice.Spice_Name}>
                <td>{spice.Spice_Name}</td>
                <td>{spice.Selling_Price}</td>
                <td>{spice.Stock}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SpicesList;
