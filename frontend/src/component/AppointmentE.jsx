import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox } from "@mui/material";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [branchId, setBranchId] = useState(null);

  useEffect(() => {
    const fetchBranchIdAndAppointments = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.User_ID) {
          console.error("User not found in local storage");
          return;
        }

        const { User_ID } = user;

        // Fetch Branch_ID for the manager
        const branchResponse = await axios.get(`http://localhost:8081/get_branch_by_user/${User_ID}`);
        const { Branch_ID } = branchResponse.data;
        setBranchId(Branch_ID);

        // Fetch appointments related to Branch_ID
        const appointmentsResponse = await axios.get(`http://localhost:8081/view_appointments_bm`, {
          params: { branchId: Branch_ID }
        });
        setAppointments(appointmentsResponse.data);
      } catch (error) {
        console.error("Error fetching branch ID or appointments:", error.message);
      }
    };

    fetchBranchIdAndAppointments();
  }, []);

  const handleApprovalChange = async (id, approval) => {
    try {
      const updatedAppointments = appointments.map(appointment =>
        appointment.Appointment_ID === id ? { ...appointment, Approval: approval } : appointment
      );
      setAppointments(updatedAppointments);
      await axios.post("http://localhost:8081/update_appointment", { id, approval });
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
