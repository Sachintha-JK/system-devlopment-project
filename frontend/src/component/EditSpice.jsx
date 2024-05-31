import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

function EditSpice({ spice, onSave, onClose }) {
  const [editedSpice, setEditedSpice] = useState({ ...spice });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedSpice(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8081/editspice/${spice.Spice_ID}`, editedSpice);
      if (response.data.success) {
        onSave(editedSpice);
      }
    } catch (error) {
      console.error('Error editing spice:', error);
      // Handle error
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formSpiceName">
        <Form.Label>Spice Name</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter spice name" 
          name="Spice_Name" 
          value={editedSpice.Spice_Name} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      
      <Form.Group controlId="formBuyingPrice">
        <Form.Label>Buying Price</Form.Label>
        <Form.Control 
          type="number" 
          placeholder="Enter buying price" 
          name="Buying_Price" 
          value={editedSpice.Buying_Price} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formSellingPrice">
        <Form.Label>Selling Price</Form.Label>
        <Form.Control 
          type="number" 
          placeholder="Enter selling price" 
          name="Selling_Price" 
          value={editedSpice.Selling_Price} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Save
      </Button>
      <Button variant="secondary" onClick={onClose} style={{ marginLeft: '10px' }}>
        Cancel
      </Button>
    </Form>
  );
}

export default EditSpice;
