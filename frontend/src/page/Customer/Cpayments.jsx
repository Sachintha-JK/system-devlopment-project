import React, { useState, useEffect } from "react";
import CustomerBar from "../../component/CustomerBar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import axios from "axios";
import moment from "moment";

function Cpayments() {
  const [orders, setOrders] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const fetchCustomerId = async () => {
    try {
      const userJson = localStorage.getItem("user");
      if (!userJson) {
        throw new Error("User not found in local storage");
      }
      const user = JSON.parse(userJson);
      const userId = user.User_ID;
      const response = await axios.get(
        `http://localhost:8081/customer/${userId}`
      );
      const customerId = response.data.customerId;
      setCustomerId(customerId);
    } catch (error) {
      console.error("Error fetching customerId:", error);
    }
  };

  useEffect(() => {
    fetchCustomerId();
  }, []);

  const fetchCustomerOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/customer_order/${customerId}`
      );
      console.log("Order data:", response.data);
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerOrders();
    }
  }, [customerId]);

  useEffect(() => {
    calculateTotals();
  }, [orders, selectedMonth, selectedYear]);

  const calculateTotals = () => {
    let paid = 0;
    let unpaid = 0;
    let pending = 0;
    let total = 0;

    orders.forEach((order) => {
      if (
        selectedMonth &&
        moment(order.Deliver_Date).format("MM") !== selectedMonth
      ) {
        return;
      }
      if (
        selectedYear &&
        moment(order.Deliver_Date).format("YYYY") !== selectedYear
      ) {
        return;
      }

      total += parseFloat(order.Payment);

      if (order.Payment_Status === 1) {
        paid += parseFloat(order.Payment);
      } else if (moment(order.Deliver_Date).isBefore(moment(), "day")) {
        unpaid += parseFloat(order.Payment);
      } else {
        pending += parseFloat(order.Payment);
      }
    });

    setTotalPaid(paid);
    setTotalUnpaid(unpaid);
    setTotalPending(pending);
    setTotalAmount(total);
  };

  // Extract unique years from orders
  const years = Array.from(
    new Set(orders.map((order) => moment(order.Deliver_Date).format("YYYY")))
  );

  return (
    <div>
      <div>
        <CustomerBar />
      </div>

      <div
        style={{
          padding: "20px",
          marginBottom: "20px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Card
          style={{ width: "100%", maxWidth: "600px", backgroundColor: "#DDD", paddingLeft:'2rem' }}
        >
          <CardContent>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <select
                onChange={(e) => setSelectedMonth(e.target.value)}
                value={selectedMonth}
              >
                <option value="">All Months</option>
                {[...Array(12).keys()].map((month) => (
                  <option
                    key={month + 1}
                    value={(month + 1).toString().padStart(2, "0")}
                  >
                    {moment(`${month + 1}`, "MM").format("MMMM")}
                  </option>
                ))}
              </select>
              <select
                onChange={(e) => setSelectedYear(e.target.value)}
                value={selectedYear}
                style={{ marginLeft: "10px" }}
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div style={{display:"flex",alignItems:'center',justifyContent:'space-between',marginTop:'1rem'
  
            }}>
              <div style={{color:'green'}}>
                Total Paid{" "}
                <span style={{ fontSize: "1.2rem", fontWeight:'bold' }}>
                  {totalPaid.toFixed(2)}
                </span>
              </div>
              <div style={{color:'red'}}>
                Total Unpaid{" "}
                <span style={{ fontSize: "1.2rem", fontWeight:'bold' }}>
                  {totalUnpaid.toFixed(2)}
                </span>
              </div>
              <div>
                Total Pending{" "}
                <span style={{ fontSize: "1.2rem", fontWeight:'bold' }}>
                  {totalPending.toFixed(2)}
                </span>
              </div>
              <div>
                Total Amount{" "}
                <span style={{ fontSize: "1.2rem", fontWeight:'bold' }}>
                  {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        style={{ marginLeft: "50px", padding: "20px", width: "fit-content" }}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Order Number
                </TableCell>
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>Spice Type</div>
                    <div>
                      <div>Quantity</div>
                      <div>(kg)</div>
                    </div>
                    <div>
                      <div>Value</div>
                      <div>(LKR)</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Deliver Date
                </TableCell>
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Total Value (LKR)
                </TableCell>
                <TableCell style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Payment Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((customer_order) => {
                if (
                  (!selectedMonth ||
                    moment(customer_order.Deliver_Date).format("MM") ===
                      selectedMonth) &&
                  (!selectedYear ||
                    moment(customer_order.Deliver_Date).format("YYYY") ===
                      selectedYear)
                ) {
                  return (
                    <TableRow key={customer_order.Order_ID}>
                      <TableCell>{customer_order.Order_ID}</TableCell>
                      <TableCell>
                        {customer_order.Spices.split(",").map((item, index) => {
                          const [name, qty, value] = item.split(" - ");
                          return (
                            <div key={index}>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "200px",
                                }}
                              >
                                {name}
                              </span>
                              <span
                                style={{
                                  display: "inline-block",
                                  width: "100px",
                                }}
                              >
                                {qty}
                              </span>
                              <span>{value}</span>
                            </div>
                          );
                        })}
                      </TableCell>
                      <TableCell>
                        {moment(customer_order.Deliver_Date).format(
                          "MM/DD/YYYY"
                        )}
                      </TableCell>
                      <TableCell>{customer_order.Payment}</TableCell>
                      <TableCell style={{color:(customer_order.Payment_Status===1) ? 'green' : customer_order.Deliver_Date >
                            moment().format("YYYY-MM-DD")
                          ? "gray" : 'red'}}>
                        {customer_order.Payment_Status === 1
                          ? "Paid"
                          : customer_order.Deliver_Date >
                            moment().format("YYYY-MM-DD")
                          ? "Pending"
                          : "Unpaid"}
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return null;
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Cpayments;
