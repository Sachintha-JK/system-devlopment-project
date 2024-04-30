import React, { useState } from 'react';
import AccountNbar from '../../component/AccountNbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Calendar from 'react-calendar'; 

function Appointment() {
  const [showAvailableDates, setShowAvailableDates] = useState(false);
  const [showScheduledAppointments, setShowScheduledAppointments] = useState(false);

  const handleCloseAvailableDates = () => setShowAvailableDates(false);
  const handleShowAvailableDates = () => setShowAvailableDates(true);

  const handleCloseScheduledAppointments = () => setShowScheduledAppointments(false);
  const handleShowScheduledAppointments = () => setShowScheduledAppointments(true);

  return (
    <div>
      <AccountNbar />
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Appointments</h1>
      </div>
      <div style={{ display: 'inline-block' }}>
        <Button variant="info" onClick={handleShowAvailableDates} style={{ marginRight: '30px', marginLeft: '60px' }}>View Available Dates</Button>
        <Button variant="success" onClick={handleShowScheduledAppointments} style={{ marginLeft: '20px' }}>My Scheduled Appointments</Button>
      </div>

      <br />
      <br />
      <div style={{ marginLeft: '60px', border: '1px solid black', padding: '20px', width: 'fit-content' }}>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicType">


          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Customer ID</Form.Label>
            <Form.Control type="Date" placeholder="Select the Date" />
          </Form.Group>

            <Form.Label>Spice Type</Form.Label>
            <Form.Select aria-label="Default select example" >
              <option>Open this select menu</option>
              <option value="1">Cinnamon</option>
              <option value="2">Pepper</option>
              <option value="3">Cloves</option>
              <option value="2">Karunka</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <Form.Control type="Date" placeholder="Select the Date" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicTime">
            <Form.Label>Time</Form.Label>
            <Form.Control type="Time" placeholder="Select the Time" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
      <Offcanvas show={showAvailableDates} onHide={handleCloseAvailableDates}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Available Dates</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Calendar /> {/* Replace placeholder text with Calendar component */}
        </Offcanvas.Body>
      </Offcanvas>
      <Offcanvas show={showScheduledAppointments} onHide={handleCloseScheduledAppointments}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My Scheduled Appointments</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Display scheduled appointments here */}
          <p>This section will display your scheduled appointments</p>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Appointment;