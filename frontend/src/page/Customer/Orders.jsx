import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountNbar from '../../component/AccountNbar'; // Assuming this is a custom component
import { Button, Form, Offcanvas } from 'react-bootstrap';

function Orders() {
  // State variables
  const [spices, setSpices] = useState([]);
  const [formFields, setFormFields] = useState([{ spice: '', quantity: '' }]);

  // Function to add new form fields
  const addFormField = () => {
    setFormFields([...formFields, { spice: '', quantity: '' }]);
  };

  // Fetch spices data when component mounts
  useEffect(() => {
    const fetchSpices = async () => {
      try {
        const response = await axios.get('http://localhost:8081/spice');
        setSpices(response.data);
      } catch (error) {
        console.error('Error fetching Spices:', error);
      }
    };

    fetchSpices();
  }, []);

  return (
    <div>
      {/* Custom account navigation bar */}
      <AccountNbar />
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Orders</h1>
      </div>

      <div style={{ marginLeft: '60px', border: '1px solid black', padding: '20px', width: 'fit-content' }}>
        <Form>
          {/* Form fields */}
          {formFields.map((field, index) => (
            <div key={index} className="d-flex flex-row align-items-center mb-3">
              {/* Spice type dropdown */}
              <Form.Group className="flex-fill" controlId={`formBasicType${index}`}>
                <Form.Label>Spice Type</Form.Label>
                <Form.Select
                  aria-label="Default select example"
                  value={field.spice}
                  onChange={(e) =>
                    setFormFields(
                      formFields.map((item, i) =>
                        i === index ? { ...item, spice: e.target.value } : item
                      )
                    )
                  }
                >
                  <option>Open this select menu</option>
                  {spices.map((spice) => (
                    <option key={spice.Spice_Id} value={spice.Spice_Name}>
                      {spice.Spice_Name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Quantity input */}
              <Form.Group className="flex-fill ms-3" controlId={`formBasicTime${index}`}>
                <Form.Label>Quantity</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type="number"
                    placeholder="Add the Quantity"
                    value={field.quantity}
                    onChange={(e) =>
                      setFormFields(
                        formFields.map((item, i) =>
                          i === index ? { ...item, quantity: e.target.value } : item
                        )
                      )
                    }
                    className="me-2"
                  />
                  {/* Add new field button */}
                  {index === formFields.length - 1 && (
                    <Button variant="info" onClick={addFormField}>
                      +
                    </Button>
                  )}
                </div>
              </Form.Group>
            </div>
          ))}

          {/* Submit button */}
          <div className="d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Order
            </Button>
          </div>
        </Form>
      </div>
      <br />
      <br />
    </div>
  );
}

export default Orders;
