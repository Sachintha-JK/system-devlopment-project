import React, { useState, useEffect } from "react";
import axios from "axios";
import AccountNbar from "../../component/AccountNbar";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Drawer,
} from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import moment from "moment";

function Appointment() {
  const [supplierId, setSupplierId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showScheduledAppointments, setShowScheduledAppointments] = useState(false);
  const [spiceTypes, setSpiceTypes] = useState([]);
  const [formData, setFormData] = useState({
    selecteddate: new Date().toISOString().split("T")[0], // Current date as default
    time: "",
    spices: [{ spiceId: "", spiceName: "", quantity: "" }],
  });
  const [timeslots, settimeslots] = useState([]);

  useEffect(() => {
    // Fetch appointments for the selected date
    console.log(formData.selecteddate);
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/checktime/${formData.selecteddate}`
        );
        settimeslots(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [formData.selecteddate]);

  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":");
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const hours = h % 12 || 12;
    return `${hours}:${minute} ${ampm}`;
  };

  const generateTimeOptions = () => {
    const options = [];
    let start = 8 * 60; // 8:00 AM in minutes
    const end = 17 * 60; // 5:00 PM in minutes
    console.log(timeslots);
    const bookedTimes = timeslots.map((timeslot) =>
      convertTo12HourFormat(timeslot.time)
    );
    console.log(bookedTimes);

    while (start <= end) {
      const hours = Math.floor(start / 60);
      const minutes = start % 60;
      const time = `${hours % 12 || 12}:${minutes
        .toString()
        .padStart(2, "0")} ${hours < 12 ? "AM" : "PM"}`;
      const isDisabled = bookedTimes.includes(time);
      options.push(
        <MenuItem key={start} value={time} disabled={isDisabled}>
          {time}
        </MenuItem>
      );
      start += 15;
    }
    return options;
  };

  const handleCloseScheduledAppointments = () => setShowScheduledAppointments(false);
  const handleShowScheduledAppointments = () => setShowScheduledAppointments(true);

  const fetchSupplierId = async () => {
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

      const response = await axios.get(
        `http://localhost:8081/supplier/${userId}`
      );
      if (response.status === 200) {
        const supplierId = response.data.supplierId;
        setSupplierId(supplierId);
      } else {
        throw new Error(`Failed to fetch supplierId: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching supplierId:", error.message);
    }
  };

  const fetchSpiceTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8081/spice");
      setSpiceTypes(response.data);
    } catch (error) {
      console.error("Error fetching spice types:", error.message);
    }
  };

  useEffect(() => {
    fetchSupplierId();
    fetchSpiceTypes();
  }, []);

  const fetchSupplierAppointments = async () => {
    if (!supplierId) return;

    try {
      const response = await axios.get(
        `http://localhost:8081/appointment/${supplierId}`
      );
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  };

  useEffect(() => {
    fetchSupplierAppointments();
  }, [supplierId]);

  const handleSpiceChange = (index, field, value) => {
    const updatedSpices = [...formData.spices];
    if (field === "spiceId") {
      const selectedSpice = spiceTypes.find(
        (spice) => spice.Spice_Id === value
      );
      updatedSpices[index] = {
        ...updatedSpices[index],
        spiceId: value,
        spiceName: selectedSpice ? selectedSpice.Spice_Name : "",
      };
    } else {
      updatedSpices[index][field] = value;
    }
    console.log("Updated Spices:", updatedSpices);
    setFormData({ ...formData, spices: updatedSpices });
  };

  const addSpiceField = () => {
    setFormData({
      ...formData,
      spices: [
        ...formData.spices,
        { spiceId: "", spiceName: "", quantity: "" },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supplierId) {
      console.error("Supplier ID is not available");
      return;
    }
    const description = formData.spices
      .map((spice) => `${spice.spiceName || "undefined"}-${spice.quantity}`)
      .join(", ");

    try {
      await axios.post("http://localhost:8081/appointment", {
        supplierId,
        selecteddate: formData.selecteddate,
        time: formData.time,
        spices: formData.spices,
        description,
      });
      // Reset form after successful submission
      setFormData({
        selecteddate: new Date().toISOString().split("T")[0],
        time: "",
        spices: [{ spiceId: "", spiceName: "", quantity: "" }],
      });
      // Refetch appointments
      fetchSupplierAppointments();
    } catch (error) {
      console.error("Error submitting appointment:", error.message);
    }
  };

  return (
    <Container>
      <AccountNbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          mt: 5,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Appointments
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleShowScheduledAppointments}
          >
            My Scheduled Appointments
          </Button>
        </Box>
        <Paper
          elevation={3}
          sx={{ p: 4, width: 400, display: "flex", flexDirection: "column" }}
        >
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Date"
                type="date"
                value={formData.selecteddate}
                onChange={(e) =>
                  setFormData({ ...formData, selecteddate: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="time-label">Time</InputLabel>
              <Select
                labelId="time-label"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                label="Time"
                required
              >
                <MenuItem value="">Select the Time</MenuItem>
                {generateTimeOptions()}
              </Select>
            </FormControl>
            {formData.spices.map((spice, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                <FormControl fullWidth margin="normal" sx={{ mr: 1 }}>
                  <InputLabel id={`spice-label-${index}`}>Spice</InputLabel>
                  <Select
                    labelId={`spice-label-${index}`}
                    value={spice.spiceId}
                    onChange={(e) =>
                      handleSpiceChange(index, "spiceId", e.target.value)
                    }
                    label="Spice"
                    required
                  >
                    <MenuItem value="">Select Spice</MenuItem>
                    {spiceTypes.map((type) => (
                      <MenuItem key={type.Spice_Id} value={type.Spice_Id}>
                        {type.Spice_Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Quantity"
                  value={spice.quantity}
                  onChange={(e) =>
                    handleSpiceChange(index, "quantity", e.target.value)
                  }
                  required
                />
              </Box>
            ))}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                onClick={addSpiceField}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: "green", // Set background color to green
                  '&:hover': {
                    backgroundColor: "#388e3c", // Darker green on hover
                  },
                }}
              >
                Add Spice
              </Button>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
      <Drawer
        anchor="right"
        open={showScheduledAppointments}
        onClose={handleCloseScheduledAppointments}
      >
        <Box sx={{ width: 400, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6">My Scheduled Appointments</Typography>
            <IconButton onClick={handleCloseScheduledAppointments}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Appointment ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Spices</TableCell>
                  <TableCell>Approval</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.Appointment_ID}>
                    <TableCell>{appointment.Appointment_ID}</TableCell>
                    <TableCell>
                      {moment(appointment.Selected_Date).format("MM/DD/YYYY")}
                    </TableCell>
                    <TableCell>{appointment.Time}</TableCell>
                    <TableCell>
                      {appointment.Spices
                        ? appointment.Spices.map((spice, index) => (
                            <div key={index}>
                              {spice.Spice_Name} - {spice.Quantity}
                            </div>
                          ))
                        : "No spices"}
                    </TableCell>
                    <TableCell>
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
        </Box>
      </Drawer>
    </Container>
  );
}

export default Appointment;
