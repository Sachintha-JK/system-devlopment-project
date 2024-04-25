import Carousel from 'react-bootstrap/Carousel';
import React from 'react';
import c1Image from '../assets/c1.png';
import c2Image from '../assets/c2.jpg';
import c3Image from '../assets/c3.jpg';

function Chome() {
  return (
    <div>
      <div className='custom-container'>
        <Carousel fade>
        <Carousel.Item>
            <img
              className="d-block w-100"
              src={c1Image}
              alt="Second slide"
              style={{
                maxHeight: '500px',
                objectFit: 'cover',
                backgroundPosition: 'fixed'
              }}
            />
        
          </Carousel.Item>

        <Carousel.Item>
            <img
              className="d-block w-100"
              src={c2Image}
              alt="First slide"
              style={{
                maxHeight: '500px',
                objectFit: 'cover',
                backgroundPosition: 'fixed'
              }}
            />
            <Carousel.Caption>
              <h3>Vikum Spice Shop</h3>
              <p>Your Trusted Partner In Spice Market.Join Us To Receive The Maximum Value For Your Harvest.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              className="d-block w-100"
              src={c3Image}
              alt="First slide"
              style={{
                maxHeight: '500px',
                objectFit: 'cover',
                backgroundPosition: 'fixed'
              }}
            />
            <Carousel.Caption>
              <h3>Vikum Spice Shop</h3>
              <p>We Provide Quality Spices For You.</p>
            </Carousel.Caption>
          </Carousel.Item>
          
        </Carousel>
      </div>
    </div>
  );
}

export default Chome;
