import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap'; // Import Form from react-bootstrap
import EditSpice from '../../component/EditSpice';

function Stock() {
  const [spices, setSpices] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSpice, setSelectedSpice] = useState(null);
  const [newSpice, setNewSpice] = useState({
    Spice_Name: '',
    Buying_Price: '',
    Selling_Price: ''
  });

  useEffect(() => {
    fetchSpices();
  }, []);

  const fetchSpices = async () => {
    try {
      const response = await axios.get('http://localhost:8081/viewspice');
      setSpices(response.data);
    } catch (error) {
      console.error('Error fetching spices:', error);
    }
  };

  const toggleProductStatus = async (spiceId, status) => {
    try {
      const response = await axios.put(`http://localhost:8081/toggleProductStatus/${spiceId}/${status}`);
      if (response.data.success) {
        setSpices(prevSpices =>
          prevSpices.map(spice => {
            if (spice.Spice_ID === spiceId) {
              return { ...spice, Active_Status: status === 'activate' ? 1 : 0 };
            } else {
              return spice;
            }
          })
        );
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  const handleEdit = (spiceId) => {
    const spice = spices.find(spice => spice.Spice_ID === spiceId);
    if (spice) {
      setSelectedSpice(spice);
      setShowEditModal(true);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleNewSpiceChange = (event) => {
    setNewSpice({
      ...newSpice,
      [event.target.name]: event.target.value
    });
  };

  const handleAddNewSpice = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8081/addspice', newSpice);
      if (response.data.success) {
        setSpices([...spices, response.data.spice]);
        setNewSpice({
          Spice_Name: '',
          Buying_Price: '',
          Selling_Price: ''
        });
      }
    } catch (error) {
      console.error('Error adding new spice:', error);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Spice Stock</h1>
      <Table striped bordered hover style={{ width: '80%', margin: '0 auto' }}>
        <thead>
          <tr>
            <th>Spice Name</th>
            <th>Buying Price</th>
            <th>Selling Price</th>
            <th>Active</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {spices.map(spice => (
            spice && (
              <tr key={spice.Spice_ID}>
                <td>{spice.Spice_Name}</td>
                <td>{spice.Buying_Price}</td>
                <td>{spice.Selling_Price}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={spice.Active_Status === 1}
                    onChange={() => toggleProductStatus(spice.Spice_ID, spice.Active_Status === 1 ? 'deactivate' : 'activate')}
                  />
                </td>
                <td>
                  <Button variant="primary" onClick={() => handleEdit(spice.Spice_ID)}>
                    Edit
                  </Button>
                </td>
              </tr>
            )
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <Form.Control
                type="text"
                name="Spice_Name"
                value={newSpice.Spice_Name}
                onChange={handleNewSpiceChange}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="Buying_Price"
                value={newSpice.Buying_Price}
                onChange={handleNewSpiceChange}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                name="Selling_Price"
                value={newSpice.Selling_Price}
                onChange={handleNewSpiceChange}
              />
            </td>
            <td colSpan="2">
              <Button variant="primary" onClick={handleAddNewSpice}>
                Add
              </Button>
            </td>
          </tr>
        </tfoot>
      </Table>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Spice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSpice && (
            <EditSpice
              spice={selectedSpice}
              onSave={(editedSpice) => {
                console.log("Edited spice data:", editedSpice);
                handleCloseEditModal();
              }}
              onClose={handleCloseEditModal}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Stock;
