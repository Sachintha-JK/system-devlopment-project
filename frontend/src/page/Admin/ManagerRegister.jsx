import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import AddManager from '../../component/AddManager';
import ProfileBar from '../../component/ProfileBar';
import AdminNBar from '../../component/AdminNBar';

function ManagerRegister() {
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get('http://localhost:8081/viewbmanagers');
        setManagers(response.data);
      } catch (error) {
        console.error('Error fetching managers:', error);
        setError('Error fetching managers. Please try again later.');
      }
    };

    fetchManagers();
  }, []);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
    <div><ProfileBar pageName="Branch Manager" /></div>
    <div style={{ display: 'flex' }}>
      <div><AdminNBar /></div>
      <div style={{ flexGrow: 1 }}></div>
    <div className="container mt-5">
      {error && <p className="text-danger">{error}</p>}
      <Button variant="primary" onClick={handleShowModal}>Add Manager</Button>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Manager_ID</th>
            <th>Name</th>
            <th>Contact_Number</th>
            <th>Email</th>
            <th>Branch_Name</th>
          </tr>
        </thead>
        <tbody>
          {managers.map(manager => (
            <tr key={manager.Manager_ID}>
              <td>{manager.Manager_ID}</td>
              <td>{manager.Name}</td>
              <td>{manager.Contact_Number}</td>
              <td>{manager.Email}</td>
              <td>{manager.Branch_Name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddManager />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div></div>
  );
}

export default ManagerRegister;
