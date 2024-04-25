import React from 'react';
import {Button, Container,Card,Row,Col} from 'react-bootstrap';
import c1Image from '../../assets/c1.png'; 
import AccountNbar from '../../component/AccountNbar';
import { useNavigate } from 'react-router-dom';

function BmanagerHome() {
  const Navigate= useNavigate();
  return (
    <>
       <div><AccountNbar/></div>

<br></br>
<br></br>
      <div className="d-flex justify-content-around">
        <Container>
          <Row>
            <Col xs={6} md={4}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={c1Image} />
                <Card.Body>
                  <Card.Title>Appointments</Card.Title>
                  <Button onClick ={()=> Navigate("/appointmentreview")} variant="primary">Enter from here</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={4}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={c1Image} />
                <Card.Body>
                  <Card.Title> Supplier Payments</Card.Title>
                  <Button onClick ={()=> Navigate("/spaymentreview")} variant="primary">Enter from here</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={4}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={c1Image} />
                <Card.Body>
                  <Card.Title>Supply</Card.Title>
                  <Button onClick ={()=> Navigate("/supply")} variant="primary">Enter from here</Button>
                </Card.Body>
              </Card>
            </Col>
            </Row>
            <br></br>
            <br></br>

            <Row>
            <Col xs={6} md={4}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={c1Image} />
                <Card.Body>
                  <Card.Title>Delivery</Card.Title>
                  <Button onClick ={()=> Navigate("/delivery")} variant="primary">Enter from here</Button>
                </Card.Body>
              </Card>
            </Col>

          </Row>
        </Container>
      </div>
    </>
  ); 
}

export default BmanagerHome;