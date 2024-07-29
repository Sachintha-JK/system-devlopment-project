import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faClipboardList, faBoxes, faDollarSign, faBoxOpen, faImage } from '@fortawesome/free-solid-svg-icons';

function BasicExample() {
  const [showRegister, setShowRegister] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showChange, setShowChange] = useState(false);

  const toggleRegister = () => {
    setShowRegister(!showRegister);
  };

  const toggleOrders = () => {
    setShowOrders(!showOrders);
  };

  const toggleInventory = () => {
    setShowInventory(!showInventory);
  };

  const linkStyle = { margin: '20px 0', marginLeft: '30px', color: 'white', fontSize: '18px' };
  const dropdownItemStyle = { margin: '10px 0 10px 50px', color: 'white', fontSize: '18px' };

  return (
    <>
      <style type="text/css">
        {`
          .nav-dropdown-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .arrow {
            border: solid white;
            border-width: 0 2px 2px 0;
            display: inline-block;
            padding: 3px;
            margin-left: 10px;
          }

          .down {
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
          }

          .up {
            transform: rotate(-135deg);
            -webkit-transform: rotate(-135deg);
          }
        `}
      </style>
      <Container fluid className="p-0 d-flex">
        <Navbar expand="lg" className="flex-column align-items-start" style={{ minHeight: '100vh', width: '200px', backgroundColor: '#1F618D' }}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="flex-column justify-content-between w-100" style={{ height: '100vh' }}>
              <div>
                <Nav.Link href="/" style={linkStyle}>
                  <FontAwesomeIcon icon={faHome} /> Home
                </Nav.Link>
                <Nav.Link style={linkStyle} onClick={toggleRegister} className="nav-dropdown-link">
                  <FontAwesomeIcon icon={faUser} /> Users <span className={`arrow ${showRegister ? 'up' : 'down'}`}></span>
                </Nav.Link>
                {showRegister && (
                  <>
                    <Nav.Link href="/aviewsupplier" style={dropdownItemStyle}>Supplier</Nav.Link>
                    <Nav.Link href="/CusRegister" style={dropdownItemStyle}>Customer</Nav.Link>
                    <Nav.Link href="/ManagerRegister" style={dropdownItemStyle}>Staff</Nav.Link>
                  </>
                )}
                <Nav.Link href="/appointmenta" style={linkStyle}>
                  <FontAwesomeIcon icon={faClipboardList} /> Appointment
                </Nav.Link>
                <Nav.Link style={linkStyle} onClick={toggleOrders} className="nav-dropdown-link">
                  <FontAwesomeIcon icon={faBoxes} /> Orders <span className={`arrow ${showOrders ? 'up' : 'down'}`}></span>
                </Nav.Link>
                {showOrders && (
                  <>
                    <Nav.Link href="/pending" style={dropdownItemStyle}>Pending Orders</Nav.Link>
                    <Nav.Link href="/orderview" style={dropdownItemStyle}>Calendar</Nav.Link>
                  </>
                )}
                <Nav.Link style={linkStyle} onClick={toggleInventory} className="nav-dropdown-link">
                  <FontAwesomeIcon icon={faDollarSign} /> Payment <span className={`arrow ${showInventory ? 'up' : 'down'}`}></span>
                </Nav.Link>
                {showInventory && (
                  <>
                    <Nav.Link href="/spaymentview" style={dropdownItemStyle}>Supplier</Nav.Link>
                    <Nav.Link href="/cpaymentview" style={dropdownItemStyle}>Customer</Nav.Link>
                  </>
                )}
                <Nav.Link href="/stock" style={linkStyle}>
                  <FontAwesomeIcon icon={faBoxOpen} /> Stock
                </Nav.Link>

                
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </Container>
    </>
  );
}

export default BasicExample;
