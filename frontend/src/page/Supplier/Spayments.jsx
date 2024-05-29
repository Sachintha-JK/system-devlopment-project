import React, { useState, useEffect } from 'react';
import AccountNbar from '../../component/AccountNbar';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function Spayments() {
  const [supplies, setSupplies] = useState([]);
  const [supplierId, setSupplierId] = useState(null);

  const fetchSupplierId = async () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) {
        throw new Error('User not found in local storage');
      }
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      const response = await axios.get(`http://localhost:8081/supplier/${userId}`);
      const supplierId = response.data.supplierId;
      setSupplierId(supplierId);
    } catch (error) {
      console.error('Error fetching supplierId:', error);
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, []);

  const fetchSupplierSupplies = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/supply/${supplierId}`);
      console.log('Supply data:', response.data);
      setSupplies(response.data.supplies);
    } catch (error) {
      console.error('Error fetching supplies:', error);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchSupplierSupplies();
    }
  }, [supplierId]);

  return (
    <div>
      <AccountNbar />
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Payments</h1>
      </div>
      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Supply No</th>
              <th>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>Spice Type</div>
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
              <th>Delivery Date</th>
              <th>Total Value (LKR)</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {supplies.map((supply) => (
              <tr key={supply.Supply_ID}>
                <td>{supply.Supply_ID}</td>
                <td>
                  {supply.Spices.split(',').map((item, index) => {
                    const [name, qty, value] = item.split(' - ');
                    return (
                      <div key={index}>
                        <span style={{ display: 'inline-block', width: '200px' }}>{name}</span>
                        <span style={{ display: 'inline-block', width: '100px' }}>{qty}</span>
                        <span>{value}</span>
                      </div>
                    );
                  })}
                </td>
                <td>{moment(supply.Date).format('MM/DD/YYYY')}</td>
                <td>{supply.Total_Value}</td>
                <td>{supply.Payment_Status === 0 ? 'Pending' : 'Paid'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Spayments;
