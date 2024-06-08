import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, Modal, FormControl, InputLabel, Input, FormHelperText } from '@mui/material'; // Import necessary Material-UI components
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

  const handleAddNewSpice = async () => {
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
      <TableContainer component={Paper} style={{ width: '80%', margin: '0 auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Spice Name</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Buying Price</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Selling Price</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Active</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {spices.map(spice => (
              spice && (
                <TableRow key={spice.Spice_ID}>
                  <TableCell><b>{spice.Spice_Name}</b></TableCell>
                  <TableCell>{spice.Buying_Price}</TableCell>
                  <TableCell>{spice.Selling_Price}</TableCell>
                  <TableCell>
                    <Checkbox checked={spice.Active_Status === 1} onChange={() => toggleProductStatus(spice.Spice_ID, spice.Active_Status === 1 ? 'deactivate' : 'activate')} />
                  </TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(spice.Spice_ID)}>Edit</Button>
                  </TableCell>
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={showEditModal} onClose={handleCloseEditModal}>
        <div>
          <h2>Edit Spice</h2>
          <EditSpice
            spice={selectedSpice}
            onSave={(editedSpice) => {
              console.log("Edited spice data:", editedSpice);
              handleCloseEditModal();
            }}
            onClose={handleCloseEditModal}
          />
        </div>
      </Modal>

      <div style={{ width: '80%', margin: '20px auto' }}>
        <FormControl fullWidth>
          <InputLabel htmlFor="spice-name">Spice Name</InputLabel>
          <Input id="spice-name" name="Spice_Name" value={newSpice.Spice_Name} onChange={handleNewSpiceChange} />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor="buying-price">Buying Price</InputLabel>
          <Input id="buying-price" name="Buying_Price" value={newSpice.Buying_Price} onChange={handleNewSpiceChange} />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor="selling-price">Selling Price</InputLabel>
          <Input id="selling-price" name="Selling_Price" value={newSpice.Selling_Price} onChange={handleNewSpiceChange} />
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAddNewSpice}>Add</Button>
      </div>
    </div>
  );
}

export default Stock;
