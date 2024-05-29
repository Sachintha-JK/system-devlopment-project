import React from 'react';
import {Button, Container,Card,Row,Col} from 'react-bootstrap';
import c1Image from '../../assets/c1.png'; 
import AccountNbar from '../../component/AccountNbar';
import { useNavigate } from 'react-router-dom';

function CusHome() {
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
                  <Card.Title>Payments</Card.Title>
                  <Card.Text>
                  Track your payment history and stay on top of your transactions for easy financial management.
                  </Card.Text>
                  <Button onClick ={()=> Navigate("/cpayments")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={4}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={c1Image} />
                <Card.Body>
                  <Card.Title>Orders</Card.Title>
                  <Card.Text>
                  Effortlessly place orders for your favorite spices with just a few clicks.
                  <br></br>
                  <br></br>
                  </Card.Text>
                  <Button onClick ={()=> Navigate("/orders")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  ); 
}

export default CusHome;