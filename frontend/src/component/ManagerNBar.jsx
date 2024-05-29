import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

function AdminNavbar() {
    return (
        <Navbar className="vertical-navbar" expand="lg" style={{ fontSize: '18px', backgroundColor: '#1F618D', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto flex-column" style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>

                    <Nav.Link href="/SupRegister" style={{ color: 'white' }}>Supplier </Nav.Link>
                    <Nav.Link href="/supply" style={{ color: 'white' }}>Supply</Nav.Link>
                    <Nav.Link href="#availability" style={{ color: 'white' }}>Availability</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AdminNavbar;
