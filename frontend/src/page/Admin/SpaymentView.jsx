import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';

function SpaymentView() {
    const [supplyDetails, setSupplyDetails] = useState([]);
  
    useEffect(() => {
      fetchSupplyDetails();
    }, []);
  
    const fetchSupplyDetails = async () => {
        try {
          const response = await axios.get('http://localhost:8081/supply_details');
          console.log('Response status:', response.status); // Log the response status
          console.log('Response data:', response.data); // Log the response data
          setSupplyDetails(response.data);
        } catch (error) {
          console.error('Error fetching supply details:', error);
        }
      };
      
    return (
        <div style={{ margin: '50px' }}>
        <h2>Supply Details</h2>
        
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Supply ID</th>
              <th>Supplier Name</th>
              <th>Supply Date</th>
              <th>Payment</th>
              <th>Spice ID</th>
              <th>Quantity</th>
              <th>Value</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {supplyDetails.map((supply) => (
              <tr key={supply.Supply_ID}>
                <td>{supply.Supply_ID}</td>
                <td>{supply.Name}</td>
                <td>{moment(supply.Supply_Date).format('YYYY-MM-DD')}</td> 
                <td>{supply.Payment}</td>
                <td>{supply.Spice_ID}</td>
                <td>{supply.Quantity}</td>
                <td>{supply.Value}</td>
                <td>{supply.Payment_Status === 1 ? 'Paid' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
}

export default SpaymentView;
