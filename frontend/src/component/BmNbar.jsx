import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import BImage from '../assets/B.jpg';
import { FaSearch } from 'react-icons/fa';

function Hnbar() {
  return (
    <div >
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <img src={BImage} alt="Your Image" style={{ height: '125px', width: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '0', right: '0', padding: '10px', display: 'flex', alignItems: 'center' }}>
          <FaSearch style={{ marginRight: '5px', color: 'white' }} /> {/* Render the search icon with white color */}
          <input type="text" placeholder="Search..." style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
      </div>
     <Navbar style={{ backgroundColor: '#D2B48C' }} data-bs-theme="light">
        <Container>
        <Navbar.Brand style={{ fontSize: '1.5rem' }}>SpiceMart</Navbar.Brand>
          <Nav className="me-auto">
            
          <Nav.Link href="/SupRegister" style={{ color: 'black' }}>Supplier</Nav.Link>
                    <Nav.Link href="/supply" style={{ color: 'black' }}>Collection</Nav.Link>
                    <Nav.Link href="/branchstock" style={{ color: 'black' }}>Availability</Nav.Link>
            
  
           
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default Hnbar;
