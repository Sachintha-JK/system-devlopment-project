import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccountNbar from '../../component/AccountNbar';
import { Button, Form, Table, Offcanvas } from 'react-bootstrap';
import moment from 'moment';

function Appointment() {
  const [supplierId, setSupplierId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showScheduledAppointments, setShowScheduledAppointments] = useState(false);
  const [formData, setFormData] = useState({
    selecteddate: new Date().toISOString().split('T')[0], // Current date as default
    time: '',
    description: ''
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
      const response = await axios.get(`http://localhost:8081/supplier/${userId}`);
      const supplierId = response.data.supplierId;
      setSupplierId(supplierId);
    } catch (error) {
      console.error('Error fetching supplierId:', error);
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, []);

  const fetchSupplierAppointments = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/appointment/${supplierId}`);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchSupplierAppointments();
    }
  }, [supplierId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/appointment', {
        supplierId: supplierId,
        selecteddate: formData.selecteddate,
        time: formData.time,
        description: formData.description
      });
      // Reset form after successful submission
      setFormData({
        selecteddate: new Date().toISOString().split('T')[0],
        time: '',
        description: ''
      });
      // Refetch appointments
      fetchSupplierAppointments();
    } catch (error) {
      console.error('Error submitting appointment:', error);
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
          <Form.Group className="mb-3" controlId="formBasicDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              placeholder="Description about the appointment" 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              required 
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <Offcanvas show={showScheduledAppointments} 
      onHide={handleCloseScheduledAppointments}
      style={{ width: '80%' }} >
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
                <th>Comment</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.Appointment_ID}>
                  <td>{appointment.Appointment_ID}</td>
                  <td>{moment(appointment.Selected_Date).format('MM/DD/YYYY')}</td>
                  <td>{appointment.Time}</td>
                  <td>{appointment.Comment}</td>
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
