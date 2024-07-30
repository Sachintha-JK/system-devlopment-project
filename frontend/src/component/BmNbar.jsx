import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import BImage from '../assets/B.jpg';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function Hnbar() {
  const navigate = useNavigate(); // Initialize the navigate function

  // Define the handleLogout function
  const handleLogout = () => {
    // Clear user details from local storage
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <img
          src={BImage}
          alt="Your Image"
          style={{ height: '125px', width: '100%', objectFit: 'cover' }}
        />
      </div>
      <Navbar style={{ backgroundColor: '#D2B48C' }} data-bs-theme="light">
        <Container>
          <Navbar.Brand style={{ fontSize: '1.5rem' }}>SpiceMart</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/SupRegister" style={{ color: 'black' }}>
              Supplier
            </Nav.Link>
            <Nav.Link href="/supply" style={{ color: 'black' }}>
              Collection
            </Nav.Link>
            <Nav.Link href="/branchstock" style={{ color: 'black' }}>
              Availability
            </Nav.Link>
            <Nav.Link href="/appointmentbm" style={{ color: 'black' }}>
              Appointment
            </Nav.Link>
            {/* Attach the handleLogout function to the Logout link */}
            <Nav.Link onClick={handleLogout} style={{ color: 'black' }}>
              Logout
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default Hnbar;
