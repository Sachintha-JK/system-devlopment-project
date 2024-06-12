import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminNBar from '../../component/AdminNBar'; // Adjust the path based on your directory structure
import Footer from '../../component/Footer'; 
import ProfileBar from '../../component/ProfileBar';

function AdminHome() {
    return (
        <div>
      <ProfileBar pageName="Home" />
      <div style={{ display: 'flex' }}>
        <AdminNBar />
      </div>
    </div>
    );
}

export default AdminHome;

  