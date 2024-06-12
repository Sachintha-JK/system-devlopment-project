import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox, Button, Modal, FormControl, InputLabel, Input, FormHelperText } from '@mui/material';
import EditSpice from '../../component/EditSpice';
import ProfileBar from '../../component/ProfileBar';
import AdminNBar from '../../component/AdminNBar';

function Stock() {
  const [spices, setSpices] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSpice, setSelectedSpice] = useState(null);
  const [newSpice, setNewSpice] = useState({
    Spice_Name: '',
    Buying_Price: '',
    Selling_Price: '',
    Image: null
  });
  const [errors, setErrors] = useState({});

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
    if (event.target.name === 'Image') {
      setNewSpice({
        ...newSpice,
        [event.target.name]: event.target.files[0]
      });
    } else {
      setNewSpice({
        ...newSpice,
        [event.target.name]: event.target.value
      });
    }
  };

  const validateNewSpice = () => {
    let tempErrors = {};
    let isValid = true;

    // Validate Spice Name
    if (!newSpice.Spice_Name.trim()) {
      tempErrors.Spice_Name = 'Spice name is required.';
      isValid = false;
    } else if (newSpice.Spice_Name.length > 40) {
      tempErrors.Spice_Name = 'Spice name must be at most 40 characters long.';
      isValid = false;
    }

    // Validate Buying Price
    if (!newSpice.Buying_Price.trim()) {
      tempErrors.Buying_Price = 'Buying price is required.';
      isValid = false;
    } else if (!/^\d+$/.test(newSpice.Buying_Price)) {
      tempErrors.Buying_Price = 'Buying price must be an integer.';
      isValid = false;
    }

    // Validate Selling Price
    if (!newSpice.Selling_Price.trim()) {
      tempErrors.Selling_Price = 'Selling price is required.';
      isValid = false;
    } else if (!/^\d+$/.test(newSpice.Selling_Price)) {
      tempErrors.Selling_Price = 'Selling price must be an integer.';
      isValid = false;
    }

    // Validate Image
    if (!newSpice.Image) {
      tempErrors.Image = 'Image is required.';
      isValid = false;
    } else if (!['image/jpeg', 'image/png'].includes(newSpice.Image.type)) {
      tempErrors.Image = 'Image must be a JPG or PNG file.';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleAddNewSpice = async (event) => {
    event.preventDefault();
    if (!validateNewSpice()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('Spice_Name', newSpice.Spice_Name);
      formData.append('Buying_Price', newSpice.Buying_Price);
      formData.append('Selling_Price', newSpice.Selling_Price);
      formData.append('Image', newSpice.Image);

      const response = await axios.post('http://localhost:8081/adspice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSpices([...spices, response.data.spice]);
        setNewSpice({
          Spice_Name: '',
          Buying_Price: '',
          Selling_Price: '',
          Image: null
        });
        setErrors({});
        alert('New spice added successfully!');
      } else {
        alert('Failed to add new spice.');
      }
    } catch (error) {
      console.error('Error adding new spice:', error);
      alert('Failed to add new spice. Please try again later.');
    }
  };

  return (
    <div>
      <div><ProfileBar pageName="Calendar" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminNBar /></div>
        <div style={{ flexGrow: 1 }}></div>
        <TableContainer component={Paper} style={{ width: '100%', margin: '0 auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Spice Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Buying Price</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Selling Price</TableCell>
                <TableCell style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Image</TableCell>
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
                      {spice.Image_Path && <img src={`http://localhost:8081/${spice.Image_Path}`} alt={spice.Spice_Name} style={{ width: '100px', height: '100px' }} />}
                    </TableCell>
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
          <FormControl fullWidth error={!!errors.Spice_Name}>
            <InputLabel htmlFor="spice-name">Spice Name</InputLabel>
            <Input id="spice-name" name="Spice_Name" value={newSpice.Spice_Name} onChange={handleNewSpiceChange} />
            {errors.Spice_Name && <FormHelperText>{errors.Spice_Name}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth error={!!errors.Buying_Price}>
            <InputLabel htmlFor="buying-price">Buying Price</InputLabel>
            <Input id="buying-price" name="Buying_Price" value={newSpice.Buying_Price} onChange={handleNewSpiceChange} />
            {errors.Buying_Price && <FormHelperText>{errors.Buying_Price}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth error={!!errors.Selling_Price}>
            <InputLabel htmlFor="selling-price">Selling Price</InputLabel>
            <Input id="selling-price" name="Selling_Price" value={newSpice.Selling_Price} onChange={handleNewSpiceChange} />
            {errors.Selling_Price && <FormHelperText>{errors.Selling_Price}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth error={!!errors.Image}>
            <InputLabel htmlFor="Image">Image</InputLabel>
            <Input id="Image" name="Image" type="file" onChange={handleNewSpiceChange} />
            {errors.Image && <FormHelperText>{errors.Image}</FormHelperText>}
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleAddNewSpice}>Add</Button>
        </div>
      </div>
    </div>
  );
}

export default Stock;
