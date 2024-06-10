import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from "@mui/material";

function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log("Fetching appointments...");
        const response = await axios.get("http://localhost:8081/view_appointments_bm");
        console.log("Appointments fetched successfully:", response.data);
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      }
    };

    fetchAppointments();
  }, []);

  const handleApprovalChange = async (id, approval) => {
    try {
      console.log(`Updating appointment ${id} to ${approval}`);
      const updatedAppointments = appointments.map(appointment =>
        appointment.Appointment_ID === id ? { ...appointment, Approval: approval } : appointment
      );
      setAppointments(updatedAppointments);
      await axios.post("http://localhost:8081/update_appointment", { id, approval });
      console.log(`Appointment ${id} updated successfully`);
    } catch (error) {
      console.error("Error updating appointment:", error.message);
    }
  };

  return (
    <div>
      <h1>Appointments</h1>
      <TableContainer component={Paper}>
        <Table aria-label="appointments table">
          <TableHead>
            <TableRow>
              <TableCell>Appointment ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Selected Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Branch Name</TableCell>
              <TableCell>Comment</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.Appointment_ID}>
                <TableCell>{appointment.Appointment_ID}</TableCell>
                <TableCell>{appointment.Name}</TableCell>
                <TableCell>{appointment.Selected_Date}</TableCell>
                <TableCell>{appointment.Time}</TableCell>
                <TableCell>{appointment.Branch_Name}</TableCell>
                <TableCell>{appointment.Comment}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={appointment.Approval === 1}
                    onChange={() => handleApprovalChange(appointment.Appointment_ID, 1)}
                  />
                  Accept
                  <Checkbox
                    checked={appointment.Approval === 0}
                    onChange={() => handleApprovalChange(appointment.Appointment_ID, 0)}
                  />
                  Decline
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Appointments;
