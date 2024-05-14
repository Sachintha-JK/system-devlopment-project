import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Hnbar() {
  return (
    <div>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
        <Navbar.Brand >SpiceMart</Navbar.Brand>
          <Nav className="me-auto">
            
            <Nav.Link href="login">Login</Nav.Link>
  
           
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default Hnbar;
