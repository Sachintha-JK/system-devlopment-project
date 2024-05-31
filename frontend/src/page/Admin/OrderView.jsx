import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

function OCalendar() {
  const [orders, setOrders] = useState([]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const localizer = momentLocalizer(moment);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8081/calendar_order');
      console.log('Order data:', response.data);
      setOrders(response.data.orders);
      const eventsData = response.data.orders.map(order => {
        const products = order.Products.split(',').map(item => {
          const [name, qty, value] = item.split(' - ');
          return `${name} (${qty}, Rs ${value})`;
        }).join(', ');
      
        let color;
        switch (order.Approval) {
          case 0:
            color = 'red';
            break;
          case 1:
            color = 'green';
            break;
          case 10:
            color = '#008ECC';
            break;
          default:
            color = '#008ECC';
        }
      
        return {
          title: `Order ${order.Order_ID}`,
          details: `Products: ${products} | Total: Rs ${order.Total_Payment}`,
          start: new Date(order.Deliver_Date),
          end: new Date(order.Deliver_Date),
          allDay: true,
          order,
          color,
          // Include Name and Company_Name
          name: order.Name,
          company: order.Company_Name,
        };
      });
      
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleEventClick = event => {
    setSelectedOrder(event.order);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <div>
     

      <div style={{ textAlign: 'center', padding: '20px', width: 'fit-content', margin: 'auto' }}>
        <h2> Calendar</h2>
        <br />
        <div style={{ textAlign: 'center', padding: '20px', width: 'fit-content', margin: 'auto', border: '2px solid black', padding: '10px', borderRadius: '5px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: '80vw', fontSize: '18px' }}
            onSelectEvent={handleEventClick}
            eventPropGetter={event => ({
              style: {
                backgroundColor: event.color,
              },
            })}
            views={['month', 'agenda']}
            dayPropGetter={(date) => {
              return {
                style: {
                  border: '1px solid black', // Set border width and color
                },
              };
            }}
          />
        </div>
      </div>

      {selectedOrder && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
  <div style={{ border: '1px solid gray', padding: '10px', borderRadius: '5px' }}>
    <p><strong>Order ID:</strong> {selectedOrder.Order_ID}</p>
    <p><strong>Name:</strong> {selectedOrder.name}</p> {/* Add Name */}
    <p><strong>Company:</strong> {selectedOrder.company}</p> {/* Add Company_Name */}
    <p><strong>Spices:</strong></p>
    <ul>
      {selectedOrder.Products.split(',').map((item, index) => {
        const [name, qty, value] = item.split(' - ');
        return (
          <li key={index}>
            {name} - {qty} (kg), Rs {value}
          </li>
        );
      })}
    </ul>
    <p><strong>Total Payment:</strong> Rs {selectedOrder.Total_Payment}</p>
    <p><strong>Deliver Date:</strong> {moment(selectedOrder.Deliver_Date).format('MM/DD/YYYY')}</p>
  </div>
</Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={handleClose}>
    Close
  </Button>
</Modal.Footer>

        </Modal>
      )}
    </div>
  );
}

export default OCalendar;