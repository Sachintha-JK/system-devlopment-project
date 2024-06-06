import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap'; // Import Form from react-bootstrap

function Stock() {
  const [spices, setSpices] = useState([]);
  const [newSpice, setNewSpice] = useState({
    Spice_Name: '',
    Buying_Price: '',
    Selling_Price: '',
    Image: null // Add a state for storing the image file
  });

  const handleNewSpiceChange = (event) => {
    if (event.target.name === 'Image') {
      // If the event is for the image input, update the state differently
      setNewSpice({
        ...newSpice,
        [event.target.name]: event.target.files[0] // Store the selected file in the state
      });
    } else {
      setNewSpice({
        ...newSpice,
        [event.target.name]: event.target.value
      });
    }
  };
  
  const handleAddNewSpice = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('Spice_Name', newSpice.Spice_Name);
      formData.append('Buying_Price', newSpice.Buying_Price);
      formData.append('Selling_Price', newSpice.Selling_Price);
      formData.append('Image', newSpice.Image); // Append the image file to the form data

      const response = await axios.post('http://localhost:8081/adspice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set content type as multipart/form-data for file upload
        }
      });
      
      if (response.data.success) {
        setSpices([...spices, response.data.spice]);
        setNewSpice({
          Spice_Name: '',
          Buying_Price: '',
          Selling_Price: '',
          Image: null // Reset the image state after successful upload
        });
        alert('New spice added successfully!');
      } else {
        alert('Failed to add new spice.');
      }
    } catch (error) {
      console.error('Error adding new spice:', error);
      alert('Failed to add new spice. Please try again later.');
    }
  };
  
  useEffect(() => {
    // Fetch spices from the backend when the component mounts
    axios.get('http://localhost:8081/spices')
      .then(response => {
        setSpices(response.data);
      })
      .catch(error => {
        console.error('Error fetching spices:', error);
      });
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Spice Stock</h1>
      <Form>
        <Form.Group controlId="formSpiceName">
          <Form.Label>Spice Name</Form.Label>
          <Form.Control
            type="text"
            name="Spice_Name"
            placeholder="Enter spice name"
            value={newSpice.Spice_Name}
            onChange={handleNewSpiceChange}
          />
        </Form.Group>
      
        <Form.Group controlId="formBuyingPrice">
          <Form.Label>Buying Price</Form.Label>
          <Form.Control
            type="text"
            name="Buying_Price"
            placeholder="Enter buying price"
            value={newSpice.Buying_Price}
            onChange={handleNewSpiceChange}
          />
        </Form.Group>
      
        <Form.Group controlId="formSellingPrice">
          <Form.Label>Selling Price</Form.Label>
          <Form.Control
            type="text"
            name="Selling_Price"
            placeholder="Enter selling price"
            value={newSpice.Selling_Price}
            onChange={handleNewSpiceChange}
          />
        </Form.Group>

        <Form.Group controlId="formImage">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            name="Image"
            onChange={handleNewSpiceChange}
          />
        </Form.Group>
      
        <Button variant="primary" onClick={handleAddNewSpice}>
          Add
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Spice Name</th>
            <th>Buying Price</th>
            <th>Selling Price</th>
            <th>Image</th> {/* Add column for image */}
          </tr>
        </thead>
        <tbody>
          {spices.map((spice, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{spice.Spice_Name}</td>
              <td>{spice.Buying_Price}</td>
              <td>{spice.Selling_Price}</td>
              <td>
                {console.log(spice.Image_Path)}
                {/* Display image if Image_Path is available */}
                {spice.Image_Path && <img src={`http://localhost:8081/${spice.Image_Path}`} alt={spice.Spice_Name} style={{ width: '100px', height: '100px' }} />}
                {/* {spice.Image_Path && <img src={spice.Image_Path} alt={spice.Spice_Name} style={{ width: '100px', height: '100px' }} />} */}

              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Stock;
