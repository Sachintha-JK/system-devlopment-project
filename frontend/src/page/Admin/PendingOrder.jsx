import React, { useState, useEffect } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function ViewPendingOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  const fetchCustomerOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8081/pending_customer_orders');
      console.log('Order data:', response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatuses({
      ...selectedStatuses,
      [orderId]: newStatus,
    });
  };

  const handleConfirmStatusChange = async (orderId, index) => {
    const newAcceptStatus = selectedStatuses[orderId];

    if (newAcceptStatus !== undefined && newAcceptStatus !== null) {
      try {
        const response = await axios.put(`http://localhost:8081/Approval_orders/${orderId}`, {
          Accept_Status: newAcceptStatus,
        });
        console.log('Accept status updated:', response.data);

        // Show confirmation message
        setConfirmationMessage(`Order ${orderId} has been ${newAcceptStatus === 1 ? 'accepted' : 'declined'} successfully.`);
        
        // Remove the confirmed order from the list
        const updatedOrders = orders.filter((_, i) => i !== index);
        setOrders(updatedOrders);

        // Clear message after 3 seconds
        setTimeout(() => setConfirmationMessage(null), 3000);
      } catch (error) {
        console.error('Error updating Accept status:', error);
      }
    }
  };

  return (
    <div>
      <h1>Customer Orders</h1>
      {confirmationMessage && (
        <Alert variant="success" style={{ position: 'fixed', top: '10px', right: '10px' }}>
          {confirmationMessage}
        </Alert>
      )}
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order No</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Contact Number</th>
              <th>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>Product</div>
                  <div>
                    <div>Quantity</div>
                    <div>(kg)</div>
                  </div>
                  <div>
                    <div>Value</div>
                    <div>(LKR)</div>
                  </div>
                </div>
              </th>
              <th>Order Date</th>
              <th>Deliver Date</th>
              <th>Total Value</th>
              <th>Action</th>
              <th>Confirm</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((customer_order, index) => (
              <tr key={customer_order.Order_ID}>
                <td>{customer_order.Order_ID}</td>
                <td>{customer_order.Customer_ID}</td>
                <td>{customer_order.Name}</td>
                <td>{customer_order.Contact_Number}</td>
                <td>
                  {customer_order['Product Details'].split(',\n').map((item, idx) => {
                    const [name, qty, value] = item.split(' - ');
                    return (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ display: 'inline-block', width: '200px' }}>{name}</span>
                        <span style={{ display: 'inline-block', width: '100px' }}>{qty}</span>
                        <span>{value}</span>
                      </div>
                    );
                  })}
                </td>
                <td>{moment(customer_order.Order_Date).format('MM/DD/YYYY')}</td>
                <td>{moment(customer_order.Deliver_Date).format('MM/DD/YYYY')}</td>
                <td>{customer_order['Total Value']}</td>
                <td>
                  <select
                    value={selectedStatuses[customer_order.Order_ID] !== undefined ? selectedStatuses[customer_order.Order_ID] : ''}
                    onChange={(e) => handleStatusChange(customer_order.Order_ID, parseInt(e.target.value))}
                  >
                    <option value="" disabled>Select</option>
                    <option value={1}>Accept</option>
                    <option value={0}>Decline</option>
                  </select>
                </td>
                <td>
                  <Button
                    onClick={() => handleConfirmStatusChange(customer_order.Order_ID, index)}
                    disabled={selectedStatuses[customer_order.Order_ID] === undefined}
                  >
                    Confirm
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default ViewPendingOrders;
