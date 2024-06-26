import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import moment from "moment";
import axios from "axios";

function AppointmentTable() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchSupplierAppointments = async () => {
      try {
        const userJson = localStorage.getItem("user");
        if (!userJson) {
          throw new Error("User not found in local storage");
        }
        const user = JSON.parse(userJson);
        const userId = user.User_ID;
        if (!userId) {
          throw new Error("User ID not found in local storage");
        }

        const response = await axios.get(`http://localhost:8081/supplier/${userId}`);
        const supplierId = response.data.supplierId;

        const appointmentsResponse = await axios.get(`http://localhost:8081/appointment/${supplierId}`);
        setAppointments(appointmentsResponse.data.appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      }
    };

    fetchSupplierAppointments();
  }, []);

  const getApprovalColor = (approval) => {
    switch (approval) {
      case 1:
        return { color: "blue" }; // Approved
      case 10:
        return { color: "darkgoldenrod" }; // Pending (dark yellow)
      case 0:
        return { color: "red" }; // Declined
      default:
        return {};
    }
  };

  return (
    <TableContainer component={Paper} sx={{ marginLeft: "20px", maxWidth: 900 }}>
      <Table sx={{ maxWidth: 900 }} aria-label="appointments table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Appointment ID</TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Date</TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Time</TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Spices</TableCell>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Approval</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.Appointment_ID}>
              <TableCell>{appointment.Appointment_ID}</TableCell>
              <TableCell>{moment(appointment.Selected_Date).format("MM/DD/YYYY")}</TableCell>
              <TableCell>{appointment.Time}</TableCell>
              <TableCell>{appointment.Comment}</TableCell>
              <TableCell style={getApprovalColor(appointment.Approval)}>
                {appointment.Approval === 1
                  ? "Approved"
                  : appointment.Approval === 10
                  ? "Pending"
                  : appointment.Approval === 0
                  ? "Declined"
                  : ""}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AppointmentTable;
