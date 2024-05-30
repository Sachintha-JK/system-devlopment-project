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
                    <Nav.Link href="#register" style={{ color: 'white' }}>Admin Panel</Nav.Link>
                    <NavDropdown title="Users" id="basic-nav-dropdown">
                    <NavDropdown.Item href="/aviewsupplier" style={{ color: 'black' }}>Supplier</NavDropdown.Item>
                        <NavDropdown.Item href="/CusRegister" style={{ color: 'black' }}>Customer</NavDropdown.Item>
                        <NavDropdown.Item href="/ManagerRegister" style={{ color: 'black' }}>Branch Manager</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="#supplier-payments" style={{ color: 'white' }}>Supplier Payments</Nav.Link>
                    <Nav.Link href="#customer-payments" style={{ color: 'white' }}>Customer Payments</Nav.Link>
                    <Nav.Link href="#orders" style={{ color: 'white' }}>Orders</Nav.Link>
                    <Nav.Link href="#availability" style={{ color: 'white' }}>Availability</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default AdminNavbar;
