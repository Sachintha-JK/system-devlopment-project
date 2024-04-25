import React from 'react';
import AccountNbar from '../../component/AccountNbar';
import Table from 'react-bootstrap/Table';


function PriceLevel() {
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
              <th>Spice Type</th>
              <th>Price for l kg(Rs)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>S001 -Cinnemon C4</td>
              <td>3200</td>
            
            </tr>


            <tr>
              <td>S001 -Cinnemon C5</td>
              <td>3500</td>
             
            </tr>

            <tr>
              <td></td>
              <td></td>
             
            </tr>
            


          </tbody>
        </Table>
      </div>
            </div>
  );
}

export default PriceLevel;