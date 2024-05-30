import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/change-password', {
        username,
        currentPassword,
        newPassword,
      });

      setStatus(response.data.status);
    } catch (error) {
      console.error(error);
      setStatus('Error changing password');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>Change Password</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Username:</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password:</label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password:</label>
                  <input
                    type="password"
                    id="newPassword"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <br/>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="submit" className="btn btn-primary btn-block">Change Password</button></div>
              </form>
              {status && <div className="alert alert-info mt-3">{status}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
