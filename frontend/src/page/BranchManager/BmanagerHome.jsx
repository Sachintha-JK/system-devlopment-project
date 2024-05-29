import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminNBar from '../../component/AdminNBar'; // Adjust the path based on your directory structure

function BmanagerHome() {
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
        </Container>
    );
}

export default BmanagerHome;

  