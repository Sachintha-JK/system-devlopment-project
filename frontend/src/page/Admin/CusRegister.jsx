import React, { useState, useEffect } from 'react';
import { Button, Table, Container, Row, Col, Form } from 'react-bootstrap';
import AddCustomer from '../../component/AddCustomer';
import EditCustomer from '../../component/EditCustomer';
import axios from 'axios';

function CusRegister() {
  const [showPopup, setShowPopup] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/customers');
        setCustomers(response.data);
        setFilteredCustomers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Error fetching customers. Please try again later.');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleToggleStatus = async (customer) => {
  const newStatus = customer.Active_Status === 1 ? 0 : 1;
  const action = newStatus === 1 ? 'activate' : 'deactivate';

  try {
    const response = await axios.put(`http://localhost:8081/${action}customer/${customer.Customer_ID}`, {
      Active_Status: newStatus,
    });
    const updatedCustomer = response.data;
    console.log("Updated customer:", updatedCustomer);

    // Update the local state with the updated customer
    setCustomers(customers.map(c => c.Customer_ID === updatedCustomer.Customer_ID ? updatedCustomer : c));
    filterCustomers(searchTerm); // Call the filterCustomers function
  } catch (error) {
    console.error(`Error ${action} customer:`, error);
  }
}

  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    filterCustomers(event.target.value);
  };

  const filterCustomers = (searchTerm) => {
    const filtered = customers.filter((customer) =>
      customer.Company_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <h1>Customers</h1>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowPopup(true)}>
            {showPopup ? 'Close' : 'Register Customer'}
          </Button>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search by Company Name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>

      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && (
        <Row className="mt-3">
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Name</th>
                  <th>Company Name</th>
                  <th>Contact Number</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(searchTerm ? filteredCustomers : customers).map((customer) => (
                  <tr key={customer.Customer_ID}>
                    <td>{customer.Customer_ID}</td>
                    <td>{customer.Name}</td>
                    <td>{customer.Company_Name}</td>
                    <td>{customer.Contact_Number}</td>
                    <td>{customer.Email}</td>
                    <td>
                      <Button variant="info" className="mr-2" onClick={() => handleEdit(customer)}>
                        Edit
                      </Button>
                      <Button
  variant={customer.Active_Status === 1 ? "danger" : "success"}
  style={{ marginLeft: '5px' }}
  onClick={() => handleToggleStatus(customer)}
>
  {customer.Active_Status === 1 ? "Deactivate" : "Activate"}
</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}

      {showPopup && (
        <Row className="mt-3">
          <Col>
            <AddCustomer handleClose={handleClose} customers={customers} />
          </Col>
        </Row>
      )}

      {showEditModal && (
        <EditCustomer
          customer={selectedCustomer}
          handleClose={handleCloseEditModal}
        />
      )}
    </Container>
  );
}

export default CusRegister;
