import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import '../../css/AdminBar.css';

function AdminHome() {
    return (
      <Navbar className="vertical-navbar">
        <Container fluid>
          <Nav className="flex-column">
            <Nav.Link href="#adminhome">Home</Nav.Link>
            <NavDropdown title="Register" id="features-dropdown">
              <NavDropdown.Item href="#SupRegister">Supplier</NavDropdown.Item>
              <NavDropdown.Item href="#CusRegister">Customer</NavDropdown.Item>
              <NavDropdown.Item href="#ManagerRegister">Branch Manager</NavDropdown.Item>
              {/* Add more features as needed */}
            </NavDropdown>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    );
  }
  
  export default AdminHome;
  