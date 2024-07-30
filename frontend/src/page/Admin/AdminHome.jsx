import React from 'react';
import AdminNBar from '../../component/AdminNBar'; 
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

  