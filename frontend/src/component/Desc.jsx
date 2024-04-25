import React from 'react';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

function Desc() {
  return (
    <>
      {[
        'Light',
      ].map((variant) => (
        <div key={variant} className="d-flex">
            
          <Card
            bg={variant.toLowerCase()}
            text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
          
            className="mb-2 mr-2"
            style={{ height: '550px',Width: 'auto',flex: '1',margin: '30px' }}
          >
            
            <Card.Body style={{ textAlign: 'justify' }}>
              
              <Card.Text style={{fontSize: '1.2rem'} }>
              Welcome to Vikum Spice! <br/>
              We're your go-to place for all things spicy in Sri Lanka. With five branches spread across <strong>Hambantota</strong> and <strong>Matara</strong>, 
              we're right where you need us to be.What makes us special? Well, we're not just any old spice company. We take pride in bringing you the best of Sri Lanka's spice scene, straight from local farmers. <strong>Cinnamon, karunka, pepper, cloves</strong> - you name it, we've got it, and it's all top-notch quality.
              At Vikum Spice, we believe in fair partnerships with our local farmers. We work closely with them to ensure that they receive fair prices for their harvests. By directly sourcing our spices from these farmers, we're able to cut out unnecessary middlemen and offer competitive prices to both our local and export customers.
              <br/><br/>So, if you're looking for a reliable partner to supply you with high-quality Sri Lankan spices, look no further than Vikum Spice. Get in touch with us today to discuss your needs and let us help you spice up your export business!
              </Card.Text>
            </Card.Body>
          </Card>
          <Accordion defaultActiveKey="0" style={{ flex: '1',margin:'30px' }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>If you are a supplier,</Accordion.Header>
              <Accordion.Body style={{ textAlign: 'justify' }}>
                <ul>
              <li>Easily schedule appointments with relevant branches.</li>
              <li>Access real-time spice price levels at the Spice Shop</li>
              <li>View your payment history for the past three months and check the payment status</li>
              <li>Specify whether you are a monthly or cash-based supplier</li>
              </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>If you are a customer,</Accordion.Header>
              <Accordion.Body style={{ textAlign: 'justify' }}>
                <ul>
              <li>View the availability of spices along with their prices in real-time.</li>
              <li>Easily place orders and pre-orders through the system.</li>
              <li>Access to their payment history, allowing them to track your transactions and ensure accuracy in billing.</li>
              <li>Receive notifications about updates on your order status and payments.</li>
              </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      ))}
    </>
  );
}

export default Desc;
