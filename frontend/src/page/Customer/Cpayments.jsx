import React, { useState, useEffect } from 'react';
import AccountNbar from '../../component/AccountNbar';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function Cpayments() {
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState(null);

  const fetchCustomerId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      const response = await axios.get(`http://localhost:8081/customer/${userId}`);
      const customerId = response.data.customerId;
      setCustomerId(customerId);
    } catch (error) {
      console.error('Error fetching customerId:', error);
    }
  };

  useEffect(() => {
    fetchCustomerId();
  }, []);

  const fetchCustomerOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/customer_order/${customerId}`);
      console.log('Order data:', response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerOrders();
    }
  }, [customerId]);

  return (
    <div>
      <div><AccountNbar/></div>
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Payments</h1>
      </div>
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Spice Type</th>
              <th>Quantity (kg)</th>
              <th>Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((customer_order) => (
              <tr key={customer_order.Order_ID}>
                <td>{customer_order.Order_ID}</td>
                <td>{customer_order.Spice_ID}</td>
                <td>{customer_order.Quantity}</td>
                <td>{moment(customer_order.Order_Date).format('MM/DD/YYYY')}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Cpayments;
