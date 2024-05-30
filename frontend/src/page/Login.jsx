import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import backgroundImage from '../assets/login.jpg';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [User_Name, setUser_Name] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/auth/login', { User_Name, Password })
      .then(res => {
        console.log(res.data);
        console.log(res.data.user.User_Type);
        if (res.data.status === "success") {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          switch (res.data.user.User_Type) {
            case 'Supplier':
              navigate('/suphome');
              break;
            case 'Customer':
              navigate('/cushome');
              break;
            case 'Branch Manager':
              navigate('/bmanagerhome');
              break;
            case 'Admin':
              navigate('/adminhome');
              break;
            default:
              setError({ message: "Unknown user type" });
          }
        } else {
          setError({ message: res.data.status });
        }
      })
      .catch(err => {
        console.error(err);
        setError(err);
      });
  }

  return (
    <div className='logsignup-container' style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className='logsignup-form'>
        <form onSubmit={handleSubmit}>
        <h1 style={{ textAlign: 'center' }}>Login</h1>
          <div className='logsignup-input'>
            <label htmlFor='User_Name'>User Name</label>
            <input 
              type='text' 
              placeholder='Enter User Name' 
              className='form-control rounded-0' 
              onChange={e => setUser_Name(e.target.value)} 
            />
          </div>

          <div className='logsignup-input'>
            <label htmlFor='Password'>Password</label>
            <input 
              type='password' 
              placeholder='Enter Password' 
              className='form-control rounded-0' 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          <Button type="submit" variant="outline-success" className='logsignup-button w-100'>
            Log in
          </Button>
        </form>
        {error && <div className="error-message">Error: {error.message}</div>}
      </div>
    </div>
  );
}

export default Login;
