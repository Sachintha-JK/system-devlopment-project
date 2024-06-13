import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import ProfileBar from '../../component/ProfileBar';
import AdminNBar from '../../component/AdminNBar';
import { Card, CardContent, Typography, Table, TableHead, TableBody, TableRow, TableCell, TextField } from '@mui/material'; // Import MUI components

function AppointmentA() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8081/manager_appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.Branch_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.Supplier_Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <ProfileBar pageName="Supplier" />
      <div style={{ display: 'flex' }}>
        <div><AdminNBar /></div>
        <div style={{ flexGrow: 1 }}></div>
        <div>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ width: '300px', textAlign: 'left' }} // Decrease width and align left
          />
          <Card style={{ margin: '0 20px', minWidth: '700px' }}> {/* Add right margin and set min-width */}
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontSize: '18px' }}><strong>Supplier ID</strong></TableCell> {/* Increase font size */}
                    <TableCell style={{ fontSize: '18px' }}><strong>Supplier Name</strong></TableCell>
                    <TableCell style={{ fontSize: '18px' }}><strong>Contact Number</strong></TableCell>
                    <TableCell style={{ fontSize: '18px' }}><strong>Selected Date</strong></TableCell>
                    <TableCell style={{ fontSize: '18px' }}><strong>Time</strong></TableCell>
                    <TableCell style={{ fontSize: '18px' }}><strong>Branch Name</strong></TableCell>
                    <TableCell style={{ fontSize: '18px' }}><strong>Comment</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments.map(appointment => (
                    <TableRow key={appointment.Supplier_ID}>
                      <TableCell>{appointment.Supplier_ID}</TableCell>
                      <TableCell>{appointment.Supplier_Name}</TableCell>
                      <TableCell>{appointment.Contact_Number}</TableCell>
                      <TableCell>{moment(appointment.Selected_Date).format('YYYY-MM-DD')}</TableCell>
                      <TableCell>{appointment.Time}</TableCell>
                      <TableCell>{appointment.Branch_Name}</TableCell>
                      <TableCell>{appointment.Comment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AppointmentA;
