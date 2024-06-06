import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountNbar from '../../component/AccountNbar';
import { Button, Form, Table, Offcanvas } from 'react-bootstrap';
import moment from 'moment';

function Appointment() {
  const [supplierId, setSupplierId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showScheduledAppointments, setShowScheduledAppointments] = useState(false);
  const [spiceTypes, setSpiceTypes] = useState([]);
  const [formData, setFormData] = useState({
    selecteddate: new Date().toISOString().split('T')[0], // Current date as default
    time: '',
    spices: [{ spiceId: '', quantity: '' }]
  });

  const handleCloseScheduledAppointments = () => setShowScheduledAppointments(false);
  const handleShowScheduledAppointments = () => setShowScheduledAppointments(true);

  const fetchSupplierId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      if (!userId) {
        throw new Error('User ID not found in local storage');
      }

      const response = await axios.get(`http://localhost:8081/supplier/${userId}`);
      if (response.status === 200) {
        const supplierId = response.data.supplierId;
        setSupplierId(supplierId);
      } else {
        throw new Error(`Failed to fetch supplierId: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching supplierId:', error.message);
    }
  };

  const fetchSpiceTypes = async () => {
    try {
      const response = await axios.get('http://localhost:8081/spice');
      setSpiceTypes(response.data);
    } catch (error) {
      console.error('Error fetching spice types:', error.message);
    }
  };

  useEffect(() => {
    fetchSupplierId();
    fetchSpiceTypes();
  }, []);

  const fetchSupplierAppointments = async () => {
    if (!supplierId) return;

    try {
      const response = await axios.get(`http://localhost:8081/appointment/${supplierId}`);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
    }
  };

  useEffect(() => {
    fetchSupplierAppointments();
  }, [supplierId]);

  const handleSpiceChange = (index, field, value) => {
    const updatedSpices = [...formData.spices];
    updatedSpices[index][field] = value;
    setFormData({ ...formData, spices: updatedSpices });
  };

  const addSpiceField = () => {
    setFormData({
      ...formData,
      spices: [...formData.spices, { spiceId: '', quantity: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierId) {
      console.error('Supplier ID is not available');
      return;
    }

    try {
      await axios.post('http://localhost:8081/appointment', {
        supplierId,
        selecteddate: formData.selecteddate,
        time: formData.time,
        spices: formData.spices
      });
      // Reset form after successful submission
      setFormData({
        selecteddate: new Date().toISOString().split('T')[0],
        time: '',
        spices: [{ spiceId: '', quantity: '' }]
      });
      // Refetch appointments
      fetchSupplierAppointments();
    } catch (error) {
      console.error('Error submitting appointment:', error.message);
    }
  };

  return (
    <div>
      <AccountNbar />
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Appointments</h1>
      </div>
      <div style={{ display: 'inline-block' }}>
        <Button variant="success" onClick={handleShowScheduledAppointments} style={{ marginLeft: '60px' }}>
          My Scheduled Appointments
        </Button>
      </div>
      <br />
      <br />
      <div style={{ marginLeft: '60px', border: '1px solid black', padding: '20px', width: '400px' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <Form.Control 
              type="date" 
              placeholder="Select the Date" 
              value={formData.selecteddate} 
              onChange={(e) => setFormData({ ...formData, selecteddate: e.target.value })} 
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicTime">
            <Form.Label>Time</Form.Label>
            <Form.Control 
              type="time" 
              placeholder="Select the Time" 
              value={formData.time} 
              onChange={(e) => setFormData({ ...formData, time: e.target.value })} 
              required 
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicSpices">
            <Form.Label>Spices</Form.Label>
            {formData.spices.map((spice, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <Form.Control 
                  as="select" 
                  value={spice.spiceId} 
                  onChange={(e) => handleSpiceChange(index, 'spiceId', e.target.value)}
                  style={{ marginRight: '10px' }}
                  required
                >
                  <option value="">Select Spice</option>
                  {spiceTypes.map((type) => (
                    <option key={type.Spice_Id} value={type.Spice_Id}>{type.Spice_Name}</option>
                  ))}
                </Form.Control>
                <Form.Control 
                  type="text" 
                  placeholder="Quantity" 
                  value={spice.quantity} 
                  onChange={(e) => handleSpiceChange(index, 'quantity', e.target.value)} 
                  required 
                />
              </div>
            ))}
            <Button variant="secondary" onClick={addSpiceField}>Add Spice</Button>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <Offcanvas show={showScheduledAppointments} onHide={handleCloseScheduledAppointments} style={{ width: '80%' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My Scheduled Appointments</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Spices</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.Appointment_ID}>
                  <td>{appointment.Appointment_ID}</td>
                  <td>{moment(appointment.Selected_Date).format('MM/DD/YYYY')}</td>
                  <td>{appointment.Time}</td>
                  <td>
                    {appointment.Spices.map((spice, index) => (
                      <div key={index}>
                        {spice.Spice_Name} - {spice.Quantity}
                      </div>
                    ))}
                  </td>
                  <td>{appointment.Approval === 1 ? 'Approved' : appointment.Approval === 10 ? 'Pending' : appointment.Approval === 0 ? 'Declined' : ''}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Appointment;
