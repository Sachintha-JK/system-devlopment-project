import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CusPayment() {
  const [spices, setSpices] = useState([]);
  const [formFields, setFormFields] = useState([{ spice: '', quantity: '' }]);
  const [supplyValue, setSupplyValue] = useState(0);
  const [contactNumber, setContactNumber] = useState('');

  useEffect(() => {
    const fetchSpices = async () => {
      try {
        const response = await axios.get('http://localhost:8081/spices');
        setSpices(response.data);
      } catch (error) {
        console.error('Error fetching Spices:', error);
      }
    };

    fetchSpices();
  }, []);

  const addFormField = () => {
    setFormFields([...formFields, { spice: '', quantity: '' }]);
  };

  const handleFormChange = (index, event) => {
    const { name, value } = event.target;
    const updatedFields = [...formFields];
    updatedFields[index][name] = value;
    setFormFields(updatedFields);
    calculateSupplyValue(updatedFields);
  };

  const calculateSupplyValue = (fields) => {
    let total = 0;
    fields.forEach(field => {
      const spice = spices.find(p => p.Spice_Name === field.spice);
      if (spice && field.quantity) {
        total += spice.Buying_Price * field.quantity;
      }
    });
    setSupplyValue(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supplyDate = moment().format('YYYY-MM-DD');
    try {
      const response = await axios.get('http://localhost:8081/find_supplier', { params: { contact: contactNumber } });
      const supplierId = response.data.supplier.Supplier_ID;

      const supplyItems = formFields.map(field => {
        const spice = spices.find(s => s.Spice_Name === field.spice);
        const quantity = parseInt(field.quantity);
        return {
          Spice_ID: spice.Spice_ID,
          Quantity: quantity,
          Value: quantity * spice.Buying_Price,
        };
      });

      const supplyData = {
        Supplier_ID: supplierId,
        Supply_Date: supplyDate,
        Contact_Number: contactNumber,
        supplyItems: supplyItems,
        supplyValue: supplyValue.toFixed(2),
      };

      console.log('Supply data:', supplyData);
      await axios.post('http://localhost:8081/add_supply', supplyData);
      toast.success('Supply placed successfully!');
      setFormFields([{ spice: '', quantity: '' }]);
      setContactNumber('');
      setSupplyValue(0);
    } catch (error) {
      console.error('Error submitting supply:', error);
      toast.error('Error submitting supply.');
    }
  };

  return (
    <div>
      <br />
      <br />
      <div style={{ textAlign: 'center' }}>
        <h1>New Supply</h1>
      </div>

      <div style={{ margin: 'auto', border: '1px solid black', padding: '20px', width: 'fit-content', fontSize: '20px' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formContactNumber">
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Contact Number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </Form.Group>

          {formFields.map((field, index) => (
            <div key={index} className="d-flex flex-row align-items-center mb-3">
              <Form.Group className="flex-fill" controlId={`formBasicType${index}`}>
                <Form.Label>Spice Type</Form.Label>
                <Form.Select
                  name="spice"
                  value={field.spice}
                  onChange={(e) => handleFormChange(index, e)}
                >
                  <option>Select the Spice</option>
                  {spices.map((spice) => (
                    <option key={spice.Spice_ID} value={spice.Spice_Name}>
                      {spice.Spice_Name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="flex-fill ms-3" controlId={`formBasicTime${index}`}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  placeholder="Add the Quantity"
                  value={field.quantity}
                  onChange={(e) => handleFormChange(index, e)}
                />
              </Form.Group>

              {index === formFields.length - 1 && (
                <Button variant="secondary" onClick={addFormField} className="ms-2" title="Add more Spice Types">
                  +
                </Button>
              )}
            </div>
          ))}

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="tooltip-submit">Submit your supply</Tooltip>}
          >
            <Button variant="primary" type="submit" className="submit-button" style={{ backgroundColor: '#1F618D', textAlign: 'center' }}>
              Submit
            </Button>
          </OverlayTrigger>
        </Form>

        <div style={{ marginTop: '20px' }}>
          <h3>Supply Value: Rs {supplyValue.toFixed(2)}</h3>
        </div>
      </div>
      <ToastContainer className="custom-toast-container" />
    </div>
  );
}

export default CusPayment;
