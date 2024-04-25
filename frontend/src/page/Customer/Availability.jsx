import React from 'react';
import AccountNbar from '../../component/AccountNbar';
import Table from 'react-bootstrap/Table';


function Availability() {
  return (
    <div>
    <div><AccountNbar/></div>

    <div style={{ marginLeft: '200px', padding: '20px', width: 'fit-content' }}>
        <h1>Availability</h1>
      </div>

      <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Spice Name</th>
              <th>Price for lkg(Rs)</th>
              <th>Available Amount(kg)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>S0-Cinnemon C4</td>
              <td>3200</td>
              <td>650</td>
            
            </tr>


            <tr>
              <td></td>
              <td></td>
              <td></td>
             
            </tr>

            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            


          </tbody>
        </Table>
      </div>
            </div>
  );
}

export default Availability;