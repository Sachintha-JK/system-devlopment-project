import React from 'react';
import AccountNbar from '../../component/AccountNbar';
import {Table, Form} from 'react-bootstrap';

function Cpayments() {
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
              <th>Quantity(kg)</th>
              <th>Date</th>
              <th>Value(Rs)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Cinnemon</td>
              <td>12</td>
              <td>08/20/2023</td>
              <td>12000</td>
              <td>
              <Form>
      <Form.Check // prettier-ignore
       disabled
        type="switch"
        label="Paid"
        id="disabled-custom-switch"
      />
    </Form>
              </td>
            </tr>


            <tr>
              <td>2</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td>3</td>
              <td></td>
              <td></td>
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

export default Cpayments;