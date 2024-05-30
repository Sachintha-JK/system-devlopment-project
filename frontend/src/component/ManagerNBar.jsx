import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function AdminNavbar() {
  return (
    <Navbar expand="lg" style={{ fontSize: '28px', backgroundColor: '#1F618D' }}>
      <Container>
            <Navbar.Brand href="/">Branch Manager</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Nav.Link href="/SupRegister" style={{ color: 'black' }}>Supplier</Nav.Link>
                    <Nav.Link href="/supply" style={{ color: 'black' }}>Supply</Nav.Link>
                    <Nav.Link href="/branchstock" style={{ color: 'black' }}>Availability</Nav.Link>
            
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AdminNavbar;
