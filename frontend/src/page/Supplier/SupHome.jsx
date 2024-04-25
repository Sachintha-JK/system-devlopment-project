import React from 'react';
import {Button, Container,Card,Row,Col} from 'react-bootstrap';
import c1Image from '../../assets/c1.png'; 
import AccountNbar from '../../component/AccountNbar';
import { useNavigate } from 'react-router-dom';

function SupHome() {
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
                  <Card.Text>
                  Easily schedule appointments for delivering your goods to the relevant branch.
                  </Card.Text>
                  <Button onClick ={()=> Navigate("/availability")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={4}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={c1Image} />
                <Card.Body>
                  <Card.Title>Payments</Card.Title>
                  <Card.Text>
                  Quickly check past orders and see if they've been paid or are still outstanding.
                  </Card.Text>
                  <Button onClick ={()=> Navigate("/spayments")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={6} md={4}>
              <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={c1Image} />
                <Card.Body>
                  <Card.Title>Price Levels</Card.Title>
                  <Card.Text>
                  View the different price levels for each category of spices available.
                  <br></br>
                  <br></br>
                  </Card.Text>
                  <Button onClick ={()=> Navigate("/pricelevel")} variant="primary">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  ); 
}

export default SupHome;