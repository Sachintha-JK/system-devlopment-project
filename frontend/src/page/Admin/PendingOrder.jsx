import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import moment from 'moment';
import ProfileBar from '../../component/ProfileBar';
import AdminNBar from '../../component/AdminNBar';

function ViewPendingOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [selectedProcesses, setSelectedProcesses] = useState({});
  const [confirmationMessage, setConfirmationMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCustomerOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8081/pending_customer_orders');
      console.log('Order data:', response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setErrorMessage('Error fetching orders');
      setTimeout(() => setErrorMessage(null), 3000); // Clear error message after 3 seconds
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

  const handleProcessChange = async (orderId, isChecked) => {
    setIsLoading(true);
    try {
      const response = await axios.put(`http://localhost:8081/process_order/${orderId}`, {
        Process: isChecked ? 'Yes' : 'No',
      });
      console.log('Process status updated:', response.data);
      // Update selectedProcesses state
      setSelectedProcesses({
        ...selectedProcesses,
        [orderId]: true,
      });
    } catch (error) {
      console.error('Error updating process status:', error);
      const errorMsg = error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : 'Error updating process status';
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(null), 3000); // Clear error message after 3 seconds
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleConfirmStatusChange = async (orderId, index) => {
    const newAcceptStatus = selectedStatuses[orderId];
    const newProcessStatus = selectedProcesses[orderId];
    setIsLoading(true);

    try {
      if (newAcceptStatus !== undefined && newAcceptStatus !== null) {
        const response = await axios.put(`http://localhost:8081/Approval_orders/${orderId}`, {
          Accept_Status: newAcceptStatus,
        });
        console.log('Accept status updated:', response.data);
      }
      // Show confirmation message
      setConfirmationMessage(`Order ${orderId} has been ${newAcceptStatus === 1 ? 'accepted' : 'declined'} and processed successfully.`);
      
      // Remove the confirmed order from the list
      const updatedOrders = orders.filter((_, i) => i !== index);
      setOrders(updatedOrders);

      // Clear message after 3 seconds
      setTimeout(() => setConfirmationMessage(null), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      const errorMsg = error.response && error.response.data && error.response.data.error 
        ? error.response.data.error 
        : 'Error updating status';
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(null), 3000); // Clear error message after 3 seconds
    }

    setIsLoading(false);
  };

  return (
    <div>
      <div><ProfileBar pageName="Pending Orders" /></div>
      <div style={{ display: 'flex' }}>
        <div><AdminNBar /></div>
        <div style={{ flexGrow: 1 }}></div>

        {confirmationMessage && (
          <Alert variant="success" style={{ position: 'fixed', top: '10px', right: '10px' }}>
            {confirmationMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="danger" style={{ position: 'fixed', top: '10px', right: '10px' }}>
            {errorMessage}
          </Alert>
        )}
        <div style={{ marginLeft: '50px', padding: '20px', width: 'fit-content' }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order No</th>
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
                <th>Request Date</th>
                <th>Total Value(Rs)</th>
                <th>Action</th>
                <th>Process</th>
                <th>Confirm</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((customer_order, index) => (
                <tr key={customer_order.Order_ID}>
                  <td>{customer_order.Order_ID}</td>
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
                  <input
  type="checkbox"
  checked={selectedProcesses[customer_order.Order_ID] || false}
  onChange={(e) => handleProcessChange(customer_order.Order_ID, e.target.checked)}
  disabled={selectedProcesses[customer_order.Order_ID] === true}
/>

                  </td>
                  <td>
                    <Button
                      onClick={() => handleConfirmStatusChange(customer_order.Order_ID, index)}
                      disabled={(selectedStatuses[customer_order.Order_ID] === undefined) || isLoading}
                    >
                      {isLoading ? <Spinner animation="border" size="sm" /> : 'Confirm'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ViewPendingOrders;

