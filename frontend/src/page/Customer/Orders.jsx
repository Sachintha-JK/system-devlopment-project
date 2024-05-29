import React, { useState, useEffect } from 'react';
import { Modal, Button, Form,Tooltip, OverlayTrigger} from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SpicesList from '../../component/Availability';


 
function CusPayment() {
  const [spices, setSpices] = useState([]);
  const [formFields, setFormFields] = useState([{ spice: '', quantity: '' }]);
  const [ordervalue, setOrderValue] = useState(0);
  const [deliverDate, setDeliverDate] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [showSpicesList, setShowSpicesList] = useState(false);
 
  const fetchCustomerId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      const response = await axios.get(`http://localhost:8081/customer/${userId}`);
      const customerId = response.data.customerId;
      setCustomerId(customerId);
    } catch (error) {
      console.error('Error fetching customerId:', error);
    }
  };

  const fetchCustomerOrders = async () => {
    // Implement fetchCustomerOrders function
  };

  useEffect(() => {
    fetchCustomerId(); // Call fetchCustomerId on component mount

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
    const updatedFields = formFields.map((field, i) =>
      i === index ? { ...field, [event.target.name]: event.target.value } : field
    );
    setFormFields(updatedFields);
    calculateOrderValue(updatedFields);
  };

  const calculateOrderValue = (fields) => {
    let total = 0;
    fields.forEach(field => {
      const spice = spices.find(p => p.Spice_Name === field.spice);
      if (spice && field.quantity) {
        total += spice.Selling_Price * field.quantity;
      }
    });
    setOrderValue(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderDate = moment().format('YYYY-MM-DD');
    try {
      const orderItems = formFields.map(field => {
        const spice = spices.find(s => s.Spice_Name === field.spice);
        const quantity = parseInt(field.quantity);
        return {
          Spice_ID: spice.Spice_ID, 
          Quantity: quantity,
          Value: field.quantity * spice.Selling_Price,
        };
      });

      const orderData = {
        Customer_ID: customerId,
        Order_Date: orderDate,
        Deliver_Date: deliverDate,
        orderItems: orderItems,
      };

      console.log('Order data:', orderData);
      await axios.post('http://localhost:8081/place_order', orderData);
      toast.success('Order placed successfully!');
      setFormFields([{ spice: '', quantity: '' }]);
      setDeliverDate('');
      setOrderValue(0);
      fetchCustomerOrders();
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Error submitting order.');
    }
  };

  return (
    <div>

    
       <br/>
       <br/>
      <div style={{ textAlign: 'center' }}>
        <h1>Orders</h1>
      </div>

      <div style={{ margin: 'auto', padding: '20px', width: 'fit-content',fontSize:'20px' }}>
      <Button variant="primary" onClick={() => setShowSpicesList(true)}>
          Check Spice Availability
        </Button>
        <SpicesList show={showSpicesList} handleClose={() => setShowSpicesList(false)} />
      </div>
      
      <div style={{ margin: 'auto', border: '1px solid black', padding: '20px', width: 'fit-content',fontSize:'20px' }}>
       <Form onSubmit={handleSubmit}>
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
                    <option key={spice.Spice_Name} value={spice.Spice_Name}>
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

          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Select the Date"
              value={deliverDate}
              onChange={(e) => setDeliverDate(e.target.value)}
              required
            />
          </Form.Group>

          

          <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-submit">Submit your order</Tooltip>}>
            <Button variant="primary" type="submit" className="submit-button" style={{ backgroundColor: '#1F618D', textAlign: 'center' }}>
           Submit
           </Button>
</OverlayTrigger>
        </Form>

        <div style={{ marginTop: '20px' }}>
          <h3>Order Value: Rs {ordervalue.toFixed(2)}</h3>
        </div>
      </div>
      <ToastContainer className="custom-toast-container" />
    </div>
  );
}

export default CusPayment;
