import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import { Tabs, Tab, Box } from "@mui/material";
import SupplierBar from "../../component/SupplierBar";
import AppointmentS from "../../component/AppointmentS";

function Appointment() {
  const [tabIndex, setTabIndex] = useState(0);
  const [supplierId, setSupplierId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [spiceTypes, setSpiceTypes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    selecteddate: new Date().toISOString().split("T")[0],
    time: "",
    spices: [{ spiceId: "", spiceName: "", quantity: "" }],
    branchId: "",
  });
  const [timeslots, settimeslots] = useState([]);
  const [errors, setErrors] = useState({
    selecteddate: "",
    spices: [{ quantity: "" }],
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/checktime/${formData.selecteddate}`);
        settimeslots(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [formData.selecteddate]);

  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(':');
    const h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hours = h % 12 || 12;
    return `${hours}:${minute} ${ampm}`;
  };

  const generateTimeOptions = () => {
    const options = [];
    let start = 8 * 60; // 8:00 AM in minutes
    const end = 17 * 60; // 5:00 PM in minutes
    const bookedTimes = timeslots.map(timeslot => convertTo12HourFormat(timeslot.time));

    while (start <= end) {
      const hours = Math.floor(start / 60);
      const minutes = start % 60;
      const time = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`;
      const isDisabled = bookedTimes.includes(time);
      options.push(
        <option key={start} value={time} disabled={isDisabled}>
          {time}
        </option>
      );
      start += 15;
    }
    return options;
  };

  const fetchSupplierId = async () => {
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) throw new Error("User not found in local storage");
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      if (!userId) throw new Error("User ID not found in local storage");

      const response = await axios.get(`http://localhost:8081/supplier/${userId}`);
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

  const fetchBranches = async () => {
    try {
      const response = await axios.get("http://localhost:8081/branches");
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error.message);
    }
  };

  useEffect(() => {
    fetchSupplierId();
    fetchSpiceTypes();
    fetchBranches();
  }, []);

  const fetchSupplierAppointments = async () => {
    if (!supplierId) return;

    try {
      const response = await axios.get(`http://localhost:8081/appointment/${supplierId}`);
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
    let updatedErrors = [...errors.spices];

    if (field === "spiceId") {
      const selectedSpice = spiceTypes.find(spice => spice.Spice_Id === value);
      updatedSpices[index] = {
        ...updatedSpices[index],
        spiceId: value,
        spiceName: selectedSpice ? selectedSpice.Spice_Name : "",
      };
    } else {
      updatedSpices[index][field] = value;
    }

    if (field === "quantity") {
      if (!/^\d+$/.test(value) || parseInt(value) <= 0 || value.length > 5) {
        updatedErrors[index] = { quantity: "Quantity must be a positive integer with a maximum length of 5." };
      } else {
        updatedErrors[index] = { quantity: "" };
      }
    }

    setFormData({ ...formData, spices: updatedSpices });
    setErrors({ ...errors, spices: updatedErrors });
  };

  const addSpiceField = () => {
    setFormData({
      ...formData,
      spices: [
        ...formData.spices,
        { spiceId: "", spiceName: "", quantity: "" },
      ],
    });
    setErrors({
      ...errors,
      spices: [
        ...errors.spices,
        { quantity: "" },
      ],
    });
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];
    let dateError = "";

    if (new Date(selectedDate) < new Date(today)) {
      dateError = "Date must be today or a future date.";
    }

    setFormData({ ...formData, selecteddate: selectedDate });
    setErrors({ ...errors, selecteddate: dateError });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supplierId) {
      console.error("Supplier ID is not available");
      return;
    }

    const hasErrors = formData.spices.some((spice, index) => {
      const quantityError = !/^\d+$/.test(spice.quantity) || parseInt(spice.quantity) <= 0 || spice.quantity.length > 5
        ? "Quantity must be a positive value"
        : "";
      if (quantityError) {
        const updatedErrors = [...errors.spices];
        updatedErrors[index] = { quantity: quantityError };
        setErrors({ ...errors, spices: updatedErrors });
      }
      return !!quantityError;
    });

    if (errors.selecteddate || hasErrors) {
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
        branchId: formData.branchId,
      });
      setFormData({
        selecteddate: new Date().toISOString().split("T")[0],
        time: "",
        spices: [{ spiceId: "", spiceName: "", quantity: "" }],
        branchId: "",
      });
      setErrors({
        selecteddate: "",
        spices: [{ quantity: "" }],
      });
      fetchSupplierAppointments();
    } catch (error) {
      console.error("Error submitting appointment:", error.message);
    }
  };

  return (
    <div>
      <SupplierBar />

      <Box>
        <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)}>
          <Tab label="Book Appointment" />
          <Tab label="View Status" />
        </Tabs>
        {tabIndex === 0 && (
          <div>
            <br />
            <br />
            <Form onSubmit={handleSubmit} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "5px", width: "500px", marginLeft: "50px" }}>
              <Form.Group className="mb-3" controlId="formBasicDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Select the Date"
                  value={formData.selecteddate}
                  onChange={handleDateChange}
                  required
                  isInvalid={!!errors.selecteddate}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.selecteddate}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicTime">
                <Form.Label>Time</Form.Label>
                <Form.Select
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                >
                  <option value="">Select the Time</option>
                  {generateTimeOptions()}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicBranch">
                <Form.Label>Branch</Form.Label>
                <Form.Select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch.Branch_ID} value={branch.Branch_ID}>
                      {branch.Branch_Name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicSpices">
                <Form.Label>Spices</Form.Label>
                {formData.spices.map((spice, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <Form.Control
                      as="select"
                      value={spice.spiceId}
                      onChange={(e) =>
                        handleSpiceChange(index, "spiceId", e.target.value)
                      }
                      style={{ marginRight: "10px" }}
                      required
                    >
                      <option value="">Select Spice</option>
                      {spiceTypes.map((type) => (
                        <option key={type.Spice_Id} value={type.Spice_Id}>
                          {type.Spice_Name}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      type="number"
                      min="1"  // Ensure only positive numbers
                      placeholder="Quantity"
                      value={spice.quantity}
                      onChange={(e) =>
                        handleSpiceChange(index, "quantity", e.target.value)
                      }
                      required
                      isInvalid={!!errors.spices[index]?.quantity}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.spices[index]?.quantity}
                    </Form.Control.Feedback>
                  </div>
                ))}
                <Button variant="secondary" onClick={addSpiceField}>
                  Add Spice
                </Button>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        )}
        {tabIndex === 1 && <AppointmentS />}
      </Box>
    </div>
  );
}

export default Appointment;
