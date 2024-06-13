import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Tooltip
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CusPayment() {
  const [spices, setSpices] = useState([]);
  const [formFields, setFormFields] = useState([{ spice: '', quantity: '' }]);
  const [supplyValue, setSupplyValue] = useState(0);
  const [contactNumber, setContactNumber] = useState('');
  const [errors, setErrors] = useState({
    contactNumber: '',
    quantity: ''
  });

  useEffect(() => {
    const fetchSpices = async () => {
      try {
        const response = await axios.get('http://localhost:8081/spices');
        setSpices(response.data);
      } catch (error) {
        console.error('Error fetching spices:', error);
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
    fields.forEach((field) => {
      const spice = spices.find((p) => p.Spice_Name === field.spice);
      if (spice && field.quantity) {
        total += spice.Buying_Price * field.quantity;
      }
    });
    setSupplyValue(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const supplyDate = moment().format('YYYY-MM-DD');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.get('http://localhost:8081/find_supplier', {
        params: { contact: contactNumber }
      });
      const supplierId = response.data.supplier.Supplier_ID;

      // Fetch Branch_ID of the branch manager
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user ? user.User_ID : null;
      const branchManagerResponse = await axios.get(
        `http://localhost:8081/find_branch_manager/${userId}`
      );
      const branchId = branchManagerResponse.data.Branch_ID;

      const supplyItems = formFields.map((field) => {
        const spice = spices.find((s) => s.Spice_Name === field.spice);
        const quantity = parseFloat(field.quantity);
        return {
          Spice_ID: spice.Spice_ID,
          Quantity: quantity,
          Value: quantity * spice.Buying_Price
        };
      });

      const supplyData = {
        Supplier_ID: supplierId,
        Supply_Date: supplyDate,
        Contact_Number: contactNumber,
        supplyItems: supplyItems,
        supplyValue: supplyValue.toFixed(2),
        User_ID: userId,
        Branch_ID: branchId // Include Branch_ID in the data sent to backend
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

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      contactNumber: '',
      quantity: ''
    };

    if (!/^[0-9]{10}$/.test(contactNumber)) {
      newErrors.contactNumber =
        'Contact number must be 10 digits and start with 0.';
      isValid = false;
    }

    formFields.forEach((field, index) => {
      if (!/^-?\d*\.?\d+$/.test(field.quantity) || parseFloat(field.quantity) <= 0) {
        newErrors.quantity = `Quantity must be a positive number greater than 0.`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '20px' }}>
      <br />
      <br />
      <div style={{ textAlign: 'center' }}>
        <h1>New Supply</h1>
      </div>

      <div
        style={{
          margin: 'auto',
          border: '1px solid black',
          padding: '20px',
          width: 'fit-content',
          fontSize: '20px'
        }}
      >
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ marginBottom: '20px' }}>
            <InputLabel id="contact-number-label">Contact Number</InputLabel>
            <TextField
              id="contact-number"
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              error={!!errors.contactNumber              }
              helperText={errors.contactNumber}
            />
          </FormControl>

          {formFields.map((field, index) => (
            <div key={index} className="d-flex flex-row align-items-center mb-3">
              <FormControl className="flex-fill me-3" fullWidth>
                <InputLabel id={`spice-type-label-${index}`}>Spice Type</InputLabel>
                <Select
                  labelId={`spice-type-label-${index}`}
                  id={`spice-type-${index}`}
                  name="spice"
                  value={field.spice}
                  onChange={(e) => handleFormChange(index, e)}
                  required
                >
                  <MenuItem value="">Select the Spice</MenuItem>
                  {spices.map((spice) => (
                    <MenuItem key={spice.Spice_ID} value={spice.Spice_Name}>
                      {spice.Spice_Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl className="flex-fill me-3" fullWidth>
                <InputLabel id={`quantity-label-${index}`}>Quantity</InputLabel>
                <TextField
                  id={`quantity-${index}`}
                  type="number"
                  name="quantity"
                  value={field.quantity}
                  onChange={(e) => handleFormChange(index, e)}
                  required
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                />
              </FormControl>

              {index === formFields.length - 1 && (
                <Button variant="outlined" onClick={addFormField} className="ms-2" title="Add more Spice Types">
                  +
                </Button>
              )}
            </div>
          ))}

          <Tooltip title="Submit your supply">
            <Button variant="contained" type="submit" style={{ backgroundColor: '#1F618D', color: 'white', textAlign: 'center' }}>
              Submit
            </Button>
          </Tooltip>
        </form>

        <div style={{ marginTop: '20px' }}>
          <h3>Supply Value: Rs {supplyValue.toFixed(2)}</h3>
        </div>
      </div>
      <ToastContainer className="custom-toast-container" />
    </div>
  );
}

export default CusPayment;

