import React, { useEffect, useState } from 'react';
import AccountNbar from '../../component/AccountNbar';
import Table from 'react-bootstrap/Table';
import axios from 'axios';

function PriceLevel() {
  const [spices, setSpices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/spices')
      .then(response => {
        setSpices(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <div><AccountNbar/></div>

      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <h1>Price Levels</h1>
      </div>

      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
            <th>Spice ID</th>
              <th>Spice Type</th>
              <th>Price for l kg(Rs)</th>
            </tr>
          </thead>
          <tbody>
            {spices.map(spice => (
              <tr key={spice.Spice_ID}>
                <td>{spice.Spice_ID}</td>
                <td>{spice.Spice_Name}</td>
                <td>{spice.Value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default PriceLevel;
