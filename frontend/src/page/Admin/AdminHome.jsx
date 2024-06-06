import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminNBar from '../../component/AdminNBar'; // Adjust the path based on your directory structure
import Footer from '../../component/Footer'; 

function AdminHome() {
    return (
        <Container fluid>
            <Row>
                <Col xs={2} id="sidebar">
                    <AdminNBar />
                </Col>
                <Col xs={10} id="page-content">
                    {/* Your page content goes here */}
                </Col>
            </Row>
            <Footer />
        </Container>
    );
}

export default AdminHome;

  