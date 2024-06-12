import express from "express";
import cors from "cors";
import mysql from "mysql";
import moment from "moment";
import authRoute from "./routes/authRoute.js";
import db from "./config/db.js";

import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Destination folder for storing images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with current timestamp
  },
});

const upload = multer({ storage: storage });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRoute);
/*const db= mysql.createConnection({

host:"localhost",
user:"root",
password:"",
database:"spicemart"
})*/

//---------login-----------------------------------------------------------------------------------------
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM user WHERE User_Name=? and Password=? ";

  db.query(sql, [req.body.User_Name, req.body.Password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (results.length > 0) {
      const user = {
        User_ID: results[0].User_ID,
        User_Name: results[0].User_Name,
        User_Type: results[0].User_Type,
      };
      console.log(user.User_Type);
      return res.json({ status: "success", user });
    } else {
      return res.json({ status: "no record" });
    }
  });
});

//-------------------customer local storage------------------------------------
app.get("/customer/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT Customer_ID FROM customer WHERE User_ID = ?";

  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0)
      return res.status(404).json({ error: "Customer not found" });
    return res.json({ customerId: data[0].Customer_ID });
  });
});
//-------------------supplier Local Storage
app.get("/supplier/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT Supplier_ID FROM supplier WHERE User_ID = ?";

  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0)
      return res.status(404).json({ error: "Supplier not found" });



    return res.json({ supplierId: data[0].Supplier_ID });
  }
);
});

app.get("/seynath/:User_ID", (req, res) => {
  const User_ID = req.params.User_ID;
  console.log(User_ID);

  const userFindQuery = `SELECT Branch_ID FROM branch_manager WHERE User_ID = ?`;
  const sql = `
  SELECT
    s.Supply_ID, s.Supplier_ID, s.Supply_Date, s.Payment, si.Spice_ID, si.Quantity, si.Value, s.Payment_Status,
    su.Name AS Supplier_Name, su.Contact_Number, sp.Spice_Name AS Spice_Name,
    s.A_User_ID, s.P_User_ID
  FROM
    supply s
  INNER JOIN
    supply_item si ON s.Supply_ID = si.Supply_ID
  INNER JOIN
    supplier su ON s.Supplier_ID = su.Supplier_ID
  INNER JOIN
    spice sp ON si.Spice_ID = sp.Spice_ID
    WHERE s.Branch_ID = ?
  `;

  db.query(userFindQuery, [User_ID], (err, data) => {
    //if (err){return res.status(500).json({ error: "Internal Server Error" });}

    // if (data.length === 0) return res.status(404).json({ error: "Branch not found" });
    console.log("athuleee");
    const branch_ID = data[0].Branch_ID;

    db.query(sql, [branch_ID], (err, data) => {
      console.log("data is below");
      console.log(data);
      console.log("error is below");
      console.log(err);

      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (data.length === 0)
        return res.status(404).json({ error: "Branch not found" });

      
      return res.json(data);
    });
    //    return res.json({ branchId: data[0].branch_ID });
  });
});

//-------------------BManager Local Storage
app.get("/branch_manager/:userId", async (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT Manager_ID FROM branch_manager WHERE User_ID = ?";

  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0)
      return res.status(404).json({ error: "Customer not found" });
    return res.json({ managerId: data[0].Manager_ID });
  });
});
//************spices dropdown

app.get("/spice", (req, res) => {
  const sql = "SELECT Spice_ID, Spice_Name FROM spice";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching Spices", err);
      res.status(500).json({ error: "Failed to fetch Spices" });
    } else {
      res.json(result);
    }
  });
});

//--------Change Password------------------------------------------------------------------------------------------------
app.post("/change-password", (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  const sqlCheck = "SELECT * FROM user WHERE User_Name=?";

  db.query(sqlCheck, [username], (err, data) => {
    if (err) return res.json("Error");
    if (data.length > 0) {
      if (data[0].Password === currentPassword) {
        const sqlUpdate = "UPDATE user SET Password=? WHERE User_Name=?";

        db.query(sqlUpdate, [newPassword, username], (err, result) => {
          if (err) return res.json("Error");
          if (result.affectedRows > 0) {
            return res.json({ status: "success" });
          } else {
            return res.json({ status: "no record" });
          }
        });
      } else {
        return res.json({ status: "incorrect current password" });
      }
    } else {
      return res.json({ status: "no record" });
    }
  });
});

///----------Register User----------------------------------------------------------------------------------------
app.post("/user", async (req, res) => {
  const { User_Name, User_Type, Password } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO user (User_Name, User_Type, Password) VALUES (?, ?, ?)",
      [User_Name, User_Type, Password]
    );
    // Retrieve the last inserted User_ID
    db.query("SELECT LAST_INSERT_ID() AS User_ID;", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving last inserted User_ID");
        return;
      }
      // Extract the User_ID from the result
      const user_id = result[0].User_ID;

      // Send the User_ID in the response
      res.status(201).json({ User_ID: user_id });
    });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Server error");
  }
});

//------------ Register Branch Manager----------------------------------------------------------------------------------
app.post("/branch_manager", async (req, res) => {
  const { Name, Contact_Number, Email, Branch_ID, User_ID } = req.body;
  console.log("Received data to register branch manager:", req.body);

  try {
    const result = await db.query(
      "INSERT INTO branch_manager (Name, Contact_Number, Email, Branch_ID, User_ID) VALUES (?, ?, ?, ?, ?)",
      [Name, Contact_Number, Email, Branch_ID, User_ID]
    );

    console.log("Branch manager registered successfully:", result);
    res.status(201).send("Branch manager registered successfully");
  } catch (err) {
    console.error("Error registering Manager:", err);
    res.status(500).send("Server error");
  }
});

//------------- Register Customer---------------------------------------------------------------------------------
app.post("/customer", async (req, res) => {
  const { Company_Name, Name, Contact_Number, Email } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO customer(Company_Name, Name, Contact_Number, Email, User_ID) VALUES (?, ?, ?, ?, LAST_INSERT_ID())",
      [Company_Name, Name, Contact_Number, Email]
    );

    res.status(201).send("Customer registered successfully");
  } catch (err) {
    console.error("Error registering Customer:", err);
    res.status(500).send("Server error");
  }
});
//-----------Supplier- Price Level--------------------------------------------------------------------------------------------
app.get("/spices", (req, res) => {
  const sql = "SELECT * FROM spice";

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Error retrieving spices" });
    } else {
      res.json(results);
    }
  });
});
//--------------Place Order-Customer Order
/*app.post('/place_order', async (req, res) => {
  try {
    const { Customer_ID, Deliver_Date, orderItems } = req.body;
    const Order_Date = moment().format('YYYY-MM-DD');

    const insertOrderQuery = 'INSERT INTO customer_order (Customer_ID, Order_Date, Deliver_Date) VALUES (?, ?, ?)';
    const insertOrderItemQuery = 'INSERT INTO order_spice (Order_ID, Spice_ID, Quantity, Value) VALUES (?, ?, ?, ?)';

    // Insert into customer_order table
    const orderResult = await new Promise((resolve, reject) => {
      db.query(insertOrderQuery, [Customer_ID, Order_Date, Deliver_Date], (err, result) => {
        if (err) {
          console.error('Error inserting customer order:', err);
          return reject(err);
        }
        resolve(result);
      });
    });

    const Order_ID = orderResult.insertId; // Get the generated Order_ID

    // Insert into order_item table for each item in the orderItems array
    const orderItemPromises = orderItems.map(item => {
      return new Promise((resolve, reject) => {
        db.query(insertOrderItemQuery, [Order_ID, item.Spice_ID, item.Quantity, item.Value], (err) => {
          if (err) {
            console.error('Error inserting order item:', err);
            return reject(err);
          }
          resolve();
        });
      });
    });

    await Promise.all(orderItemPromises);
    res.status(200).json({ message: 'Order placed successfully!' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
});
*/

//-------------------
app.post("/plce_order", async (req, res) => {
  try {
    const { Customer_ID, Order_Date, Deliver_Date, orderItems } = req.body;
    let adjustedDeliverDate = Deliver_Date;
    const currentDate = moment().format("YYYY-MM-DD");

    const insertOrderQuery =
      "INSERT INTO customer_order (Customer_ID, Order_Date, Deliver_Date) VALUES (?, ?, ?)";
    const insertOrderItemQuery =
      "INSERT INTO order_spice (Order_ID, Spice_ID, Quantity, Value) VALUES (?, ?, ?, ?)";
    const selectSpiceStockQuery = "SELECT Stock FROM spice WHERE Spice_ID = ?";

    let canPlaceOrder = true;
    let errorMessage =
      "Cannot place order: Some items exceed stock limits and require a delivery date of at least one week from today.";

    // Check stock levels and adjust the delivery date if necessary
    for (const item of orderItems) {
      const spiceStockResult = await new Promise((resolve, reject) => {
        db.query(selectSpiceStockQuery, [item.Spice_ID], (err, result) => {
          if (err) {
            console.error("Error checking spice stock:", err);
            return reject(err);
          }
          resolve(result);
        });
      });

      const spiceStock = spiceStockResult[0].Stock;

      if (item.Quantity - spiceStock > 200) {
        if (moment(adjustedDeliverDate).diff(currentDate, "days") < 7) {
          canPlaceOrder = false;
          break;
        } else {
          adjustedDeliverDate = moment().add(1, "week").format("YYYY-MM-DD");
        }
      }
    }

    if (!canPlaceOrder) {
      return res.status(400).json({ error: errorMessage });
    }

    // Insert into customer_order table
    const orderResult = await new Promise((resolve, reject) => {
      db.query(
        insertOrderQuery,
        [Customer_ID, Order_Date, adjustedDeliverDate],
        (err, result) => {
          if (err) {
            console.error("Error inserting customer order:", err);
            return reject(err);
          }
          resolve(result);
        }
      );
    });

    const Order_ID = orderResult.insertId;

    // Insert into order_spice table for each item in the orderItems array
    const orderItemPromises = orderItems.map((item) => {
      return new Promise((resolve, reject) => {
        db.query(
          insertOrderItemQuery,
          [Order_ID, item.Spice_ID, item.Quantity, item.Value],
          (err) => {
            if (err) {
              console.error("Error inserting order item:", err);
              return reject(err);
            }
            resolve();
          }
        );
      });
    });

    await Promise.all(orderItemPromises);
    res
      .status(200)
      .json({
        message: "Order placed successfully!",
        deliveryDate: adjustedDeliverDate,
      });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: error.message });
  }
});

//---------------Payment-Customer view

app.get("/customer_order/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  const sql = `SELECT o.Order_ID, o.Deliver_Date, ao.Payment,ao.Payment_Status,
  GROUP_CONCAT(CONCAT(s.Spice_Name, ' - ', os.Quantity, '  - ', os.Value, ' ')) AS Spices,
  SUM(os.Quantity * os.Value) AS Total_Value
FROM customer_order o
JOIN order_spice os ON os.Order_ID = o.Order_ID
JOIN accept_order ao ON ao.Order_ID = o.Order_ID
JOIN spice s ON os.Spice_ID = s.Spice_ID
WHERE o.Customer_ID = ? And
o.Accept_Status = 1
GROUP BY o.Order_ID, o.Deliver_Date, ao.Payment
`;

  db.query(sql, [customerId], (err, data) => {
    if (err) {
      console.error("Database query error:", err); // Log error for debugging
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      console.log("No orders found for customer ID:", customerId); // Log no data found
      return res.status(404).json({ error: "Orders not found" });
    }
    console.log("Query result:", data); // Log the data for debugging
    console.log(data);
    return res.json({ orders: data });
  });
});
//---------Availability table
app.get("/check_stock", (req, res) => {
  const sql = "SELECT Spice_Name, Selling_Price,Stock FROM spice";

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database query error:", err); // Log error for debugging
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      console.log("No spices found"); // Log no data found
      return res.status(404).json({ error: "Spices not found" });
    }
    console.log("Query result:", data); // Log the data for debugging
    return res.json({ spices: data });
  });
});
//********************check existing time slots for he selected date************************** */
app.get("/checktime/:date", (req, res) => {
  const date = req.params.date;
  console.log("date", date);

  // SQL query to get appointments for the given date
  const query = "SELECT time FROM appointment WHERE selected_date = ?";

  // Execute the query
  db.query(query, [date], (error, results) => {
    if (error) {
      console.error("Error fetching appointments:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results);
  });
});

//***********************Customer order-Status(Customer view) */
app.get("/customer_allorder/:customerId", (req, res) => {
  const customerId = req.params.customerId;
  console.log("Received request for customer orders. Customer ID:", customerId);

  const sql = `SELECT o.Order_ID, o.Deliver_Date,
  GROUP_CONCAT(CONCAT(s.Spice_Name, ' - ', os.Quantity, '  - ', os.Value, ' ')) AS Spices,
  SUM(os.Quantity * os.Value) AS Total_Value,
  o.Accept_Status,o.Process
FROM customer_order o
JOIN order_spice os ON os.Order_ID = o.Order_ID
JOIN spice s ON os.Spice_ID = s.Spice_ID
WHERE o.Customer_ID = ?
GROUP BY o.Order_ID, o.Deliver_Date, o.Accept_Status`;

  db.query(sql, [customerId], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      console.log("No orders found for customer ID:", customerId);
      return res.status(404).json({ error: "Orders not found" });
    }
    console.log("Query result:", data);
    return res.json({ orders: data });
  });
});

//********************get branch_manager userID************************** */

app.get("/find_branch_manager/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql =
    "SELECT Manager_ID, Branch_ID FROM branch_manager WHERE User_ID = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error retrieving branch manager:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Branch manager not found" });
    }
    return res.json(result[0]);
  });
});
// ------view supplier(branch manager)
app.get("/suppliers", (req, res) => {
  const sql = `
    SELECT 
      supplier.Supplier_ID, 
      supplier.Name, 
      supplier.Contact_Number, 
      supplier.Address1, 
      supplier.Address2, 
      CONCAT(branch_manager.Manager_ID, '-', branch_manager.Name) AS Manager_Info
    FROM supplier
    JOIN branch_manager ON supplier.A_User_ID = branch_manager.User_ID
    WHERE supplier.Active_Status = 1;
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving suppliers:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "No suppliers found" });
    }
    return res.json(result);
  });
});

//************register supplier******************** */
app.post("/suppliers", (req, res) => {
  const {
    Name,
    Contact_Number,
    Address1,
    Address2,
    Branch_ID,
    User_Name,
    Password,
    A_User_ID,
  } = req.body;

  // Validate required fields
  if (
    !Name ||
    !Contact_Number ||
    !Address1 ||
    !Branch_ID ||
    !User_Name ||
    !Password
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Insert into user table
    const userQuery =
      "INSERT INTO user (User_Name, Password, User_Type) VALUES (?, ?, ?)";
    db.query(
      userQuery,
      [User_Name, Password, "Supplier"],
      (err, userResult) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error adding user to database:", err);
            res.status(500).json({ error: "Internal Server Error" });
          });
        }

        const User_ID = userResult.insertId;

        // Insert into supplier table
        const supplierQuery =
          "INSERT INTO supplier (Name, Contact_Number, Address1, Address2, Branch_ID, User_ID, A_User_ID) VALUES (?, ?, ?, ?, ?, ?,?)";
        db.query(
          supplierQuery,
          [
            Name,
            Contact_Number,
            Address1,
            Address2,
            Branch_ID,
            User_ID,
            A_User_ID,
          ],
          (err, supplierResult) => {
            if (err) {
              return db.rollback(() => {
                console.error("Error adding supplier to database:", err);
                res.status(500).json({ error: "Internal Server Error" });
              });
            }

            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error committing transaction:", err);
                  res.status(500).json({ error: "Internal Server Error" });
                });
              }

              const newSupplier = {
                Supplier_ID: supplierResult.insertId,
                Name,
                Contact_Number,
                Address1,
                Address2,
                Branch_ID,
                User_ID,
              };
              res.status(201).json(newSupplier);
            });
          }
        );
      }
    );
  });
});
//**************Update Supplier**** */

app.put("/suppliers/:id", (req, res) => {
  const supplierId = req.params.id;
  const { Name, Contact_Number, Address1, Address2 } = req.body;

  // Validate required fields
  if (!Name || !Contact_Number || !Address1) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const updateQuery = `
    UPDATE supplier 
    SET Name = ?, Contact_Number = ?, Address1 = ?, Address2 = ? 
    WHERE Supplier_ID = ?
  `;

  db.query(
    updateQuery,
    [Name, Contact_Number, Address1, Address2, supplierId],
    (err, result) => {
      if (err) {
        console.error("Error updating supplier in database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Supplier not found" });
      }

      const updatedSupplier = {
        Supplier_ID: supplierId,
        Name,
        Contact_Number,
        Address1,
        Address2,
      };

      res.status(200).json(updatedSupplier);
    }
  );
});

//*****************************deactivate supplier */

app.put("/deactivate_supplier/:id", (req, res) => {
  const supplierId = req.params.id;

  // Update Active_Status to 0 for the supplier
  const updateQuery =
    "UPDATE supplier SET Active_Status = 0 WHERE Supplier_ID = ?";
  db.query(updateQuery, [supplierId], (err, result) => {
    if (err) {
      console.error("Error deactivating supplier:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.status(200).json({ message: "Supplier deactivated successfully" });
  });
});

//*********get supply details(branch manager)********************* */

app.get("/supply_details", (req, res) => {
  const sql = `
  SELECT
    s.Supply_ID, s.Supplier_ID, s.Supply_Date, s.Payment, si.Spice_ID, si.Quantity, si.Value, s.Payment_Status,
    su.Name AS Supplier_Name, su.Contact_Number, sp.Spice_Name AS Spice_Name,
    s.A_User_ID, s.P_User_ID
  FROM
    supply s
  INNER JOIN
    supply_item si ON s.Supply_ID = si.Supply_ID
  INNER JOIN
    supplier su ON s.Supplier_ID = su.Supplier_ID
  INNER JOIN
    spice sp ON si.Spice_ID = sp.Spice_ID
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving supply details:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err });
    }
    return res.json(result);
  });
});

//********************Update Payment sttus of supplier******************** */
app.put("/update_payment_status/:supplyId", (req, res) => {
  const supplyId = parseInt(req.params.supplyId);
  const { Payment_Status, User_ID } = req.body;

  const sql = `UPDATE supply SET Payment_Status = ?, P_User_ID = ? WHERE Supply_ID = ?`;

  db.query(sql, [Payment_Status, User_ID, supplyId], (err, result) => {
    if (err) {
      console.error("Error updating payment status:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Supply detail not found" });
    }

    res.json({ success: true, message: "Payment status updated successfully" });
  });
});

//*************reset supplier payment*********************** */

app.put("/reset_payment_status/:supplyId", (req, res) => {
  const supplyId = parseInt(req.params.supplyId);

  const sql = `UPDATE supply SET Payment_Status = 0 WHERE Supply_ID = ?`;

  db.query(sql, [supplyId], (err, result) => {
    if (err) {
      console.error("Error resetting payment status:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Supply detail not found" });
    }

    res.json({ success: true, message: "Payment status reset successfully" });
  });
});

//************************************ */
// Assuming you're using Express.js
app.delete("/delete_supply/:supplyId", (req, res) => {
  const supplyId = req.params.supplyId;

  // Start a transaction to ensure atomicity
  db.beginTransaction(function (err) {
    if (err) {
      console.error("Error starting transaction:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err });
    }

    // Delete related records from other tables (if necessary)
    const deleteRelatedQuery = `DELETE FROM supply_item WHERE Supply_ID = ?`;
    db.query(deleteRelatedQuery, [supplyId], function (err, result) {
      if (err) {
        db.rollback(function () {
          console.error("Error deleting related records:", err);
          return res
            .status(500)
            .json({ error: "Internal Server Error", details: err });
        });
      }

      // Delete record from supply table
      const deleteQuery = `DELETE FROM supply WHERE Supply_ID = ?`;
      db.query(deleteQuery, [supplyId], function (err, result) {
        if (err) {
          db.rollback(function () {
            console.error("Error deleting supply:", err);
            return res
              .status(500)
              .json({ error: "Internal Server Error", details: err });
          });
        }

        // Commit the transaction
        db.commit(function (err) {
          if (err) {
            db.rollback(function () {
              console.error("Error committing transaction:", err);
              return res
                .status(500)
                .json({ error: "Internal Server Error", details: err });
            });
          }

          // Transaction successfully committed
          return res.json({
            message: "Supply and related records deleted successfully",
          });
        });
      });
    });
  });
});

//---------------Payment-supplier view

app.get("/supply/:supplierId", (req, res) => {
  const supplierId = req.params.supplierId;
  const sql = `
    SELECT s.Supply_ID, s.Supply_Date, s.Payment, s.Payment_Status,
      GROUP_CONCAT(CONCAT(ss.Spice_Name, ' - ', si.Quantity, ' - ', si.Value)) AS Spices,
      SUM(si.Quantity * si.Value) AS Total_Value
    FROM supply s
    JOIN supply_item si ON si.Supply_ID = s.Supply_ID
    JOIN spice ss ON ss.Spice_ID = si.Spice_ID
    WHERE s.Supplier_ID = ?
    GROUP BY s.Supply_ID, s.Supply_Date, s.Payment, s.Payment_Status
  `;

  db.query(sql, [supplierId], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      console.log("No supplies found for supplier ID:", supplierId);
      return res.status(404).json({ error: "Supplies not found" });
    }
    console.log("Query result:", data);
    return res.json({ supplies: data });
  });
});

//-----------------------VIEW Appointments
app.get("/appointment/:supplierId", (req, res) => {
  const supplierId = req.params.supplierId;
  const sql = "SELECT * FROM appointment WHERE Supplier_ID = ?";

  db.query(sql, [supplierId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    return res.json({ appointments: data });
  });
});
//************************Place appointment* */
app.post("/appointment", (req, res) => {
  const { supplierId, selecteddate, time, spices, description, branchId } =
    req.body;
  const currentDate = moment().format("YYYY-MM-DD"); // Get the current date in 'YYYY-MM-DD' format

  const sql =
    "INSERT INTO appointment (Supplier_ID, Date, Selected_Date, Time, Comment, Approval, Branch_ID) VALUES (?, ?, ?, ?, ?, 10, ?)"; // Assuming '10' is the default value for 'Approval'

  try {
    db.query(
      sql,
      [supplierId, currentDate, selecteddate, time, description, branchId],
      (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res
          .status(201)
          .json({
            message: "Appointment created successfully",
            appointmentId: result.insertId,
          });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//*************************************************** */
// Import necessary modules and configure database connection

// GET appointments route
// Route to view appointments for a branch manager
app.get("/view_appointments_bm", (req, res) => {
  const query = `
    SELECT 
      appointment.Appointment_ID,
      supplier.Name,
      appointment.Selected_Date,
      appointment.Time,
      branch.Branch_Name,
      appointment.Comment,
      appointment.Approval
    FROM 
      appointment
    JOIN 
      supplier ON appointment.Supplier_ID = supplier.Supplier_ID
    JOIN 
      branch ON appointment.Branch_ID = branch.Branch_ID;
  `;
  console.log("Executing query:", query); // Add this line to log the executed query
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      return res.status(500).json({ error: "Failed to fetch appointments" });
    }
    console.log("Appointments fetched successfully:", results); // Add this line to log the fetched appointments
    res.status(200).json(results);
  });
});
//*********************update appointment */
let appointments = [
  { Appointment_ID: 1, Approval: 10 },
  { Appointment_ID: 2, Approval: 10 },
  // Add other appointments here
];

app.post("/update_appointment", async (req, res) => {
  const { id, approval } = req.body;
  console.log(`Received request to update appointment ${id} to ${approval}`);

  try {
    const [result] = await pool.query(
      "UPDATE appointment SET Approval = ? WHERE Appointment_ID = ?",
      [approval, id]
    );

    if (result.affectedRows > 0) {
      console.log(`Appointment ${id} updated to ${approval}`);
      res.sendStatus(200);
    } else {
      console.log(`Appointment ${id} not found`);
      res.status(404).send("Appointment not found");
    }
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to view appointments
app.get("/view_appointments_bm", async (req, res) => {
  try {
    const [appointments] = await pool.query("SELECT * FROM appointment");
    res.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send("Internal Server Error");
  }
});

//********************************view supplies(branch manager)****************************** */
app.get("/spice_quantities/:branchId", (req, res) => {
  const branchId = req.params.branchId;
  const sql = `
    SELECT
      si.Spice_ID,
      sp.Spice_Name,
      SUM(si.Quantity) as Total_Quantity
    FROM
      supply_item si
    INNER JOIN
      supply s ON si.Supply_ID = s.Supply_ID
    INNER JOIN
      supplier su ON s.Supplier_ID = su.Supplier_ID
    INNER JOIN
      spice sp ON si.Spice_ID = sp.Spice_Id
    WHERE
      su.Branch_ID = ?
    GROUP BY
      si.Spice_ID, sp.Spice_Name
  `;

  db.query(sql, [branchId], (err, result) => {
    if (err) {
      console.error("Error retrieving spice quantities:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err });
    }
    return res.json(result);
  });
});
//*******************************Add supply */
app.post("/add_supply", async (req, res) => {
  try {
    console.log("Received supply data:", req.body);
    const { Supplier_ID, supplyItems, supplyValue, User_ID } = req.body;
    const Supply_Date = moment().format("YYYY-MM-DD");

    console.log("Supply Date:", Supply_Date);
    console.log("Supplier_ID:", Supplier_ID);
    console.log("User_ID:", User_ID);

    const insertSupplyQuery =
      "INSERT INTO supply (Supplier_ID, Supply_Date, Payment, A_User_ID) VALUES (?, ?, ?, ?)";
    const insertSupplyItemQuery =
      "INSERT INTO supply_item (Supply_ID, Spice_ID, Quantity, Value) VALUES (?, ?, ?, ?)";

    // Insert into supply table
    const supplyResult = await new Promise((resolve, reject) => {
      db.query(
        insertSupplyQuery,
        [Supplier_ID, Supply_Date, supplyValue, User_ID],
        (err, result) => {
          if (err) {
            console.error("Error inserting Supply:", err);
            return reject(err);
          }
          console.log("Supply Insert Result:", result);
          resolve(result);
        }
      );
    });

    const Supply_ID = supplyResult.insertId;
    console.log("Generated Supply_ID:", Supply_ID);

    // Insert into supply_item table for each item in the supplyItems array
    const supplyItemPromises = supplyItems.map((item) => {
      return new Promise((resolve, reject) => {
        db.query(
          insertSupplyItemQuery,
          [Supply_ID, item.Spice_ID, item.Quantity, item.Value],
          (err, result) => {
            if (err) {
              console.error("Error inserting supply item:", err);
              return reject(err);
            }
            console.log(
              `Inserted supply item for Spice_ID ${item.Spice_ID}:`,
              result
            );
            resolve();
          }
        );
      });
    });

    await Promise.all(supplyItemPromises);
    res.status(200).json({ message: "Supply placed successfully!" });
  } catch (error) {
    console.error("Error placing supply:", error.message, error.stack);
    res
      .status(500)
      .json({ error: "Failed to place supply", details: error.message });
  }
});

//------------------------------Find Supplier to add supply---------------------
app.get("/find_supplier", (req, res) => {
  const { contact } = req.query;
  const query = `
    SELECT Supplier_ID
    FROM supplier
    WHERE Contact_Number = ?
  `;
  db.query(query, [contact], (err, result) => {
    if (err) {
      res.status(500).send({ message: err.message });
    } else {
      if (result.length > 0) {
        res.send({ supplier: result[0] });
      } else {
        // If supplier not found
        console.log("Supplier not found");
        res.status(404).send({ message: "Supplier not found" });
      }
    }
  });
});
//**************View Suppliers(Branch Manager) */

app.get("/suppliers", async (req, res) => {
  try {
    const query =
      "SELECT s.*, b.Branch_Name FROM supplier s INNER JOIN branch b ON s.Branch_ID = b.Branch_ID";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching supplier data:", err);
        return res.status(500).json({ error: "Failed to fetch supplier data" });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//**********view customers******** */
app.get("/customers", (req, res) => {
  const query = "SELECT * FROM customer";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching customer data:", err);
      return res.status(500).json({ error: "Failed to fetch customer data" });
    }
    res.status(200).json(results);
  });
});
//********************************************** */
app.put("/updatecustomer/:id", (req, res) => {
  const { id } = req.params;
  const { Name, Company_Name, Contact_Number, Email } = req.body;
  const sql =
    "UPDATE customer SET Name = ?, Company_Name = ?, Contact_Number = ?, Email = ? WHERE Customer_ID = ?";
  db.query(
    sql,
    [Name, Company_Name, Contact_Number, Email, id],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send({ success: true });
      }
    }
  );
});
//*********************deactivate customer */
app.put("/deactivateCustomer/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to deactivate customer with ID: ${id}`);
  const sql = "UPDATE customer SET Active_Status = 0 WHERE Customer_ID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      res.status(500).send({ error: "Database query failed", details: err });
    } else if (result.affectedRows === 0) {
      console.warn(`Product with ID: ${id} not found`);
      res.status(404).send({ error: "Product not found" });
    } else {
      console.log(`Product with ID: ${id} deactivated successfully`);
      res.send({ success: true });
    }
  });
});

//******************** */
app.put("/activatecustomer/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to activate customer with ID: ${id}`);
  const sql = "UPDATE customer SET Active_Status = 1 WHERE Customer_ID = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      res.status(500).send({ error: "Database query failed", details: err });
    } else if (result.affectedRows === 0) {
      console.warn(`Customer with ID: ${id} not found`);
      res.status(404).send({ error: "Customer not found" });
    } else {
      console.log(`Customer with ID: ${id} activated successfully`);
      res.send({ Customer_ID: id, Active_Status: 1 });
    }
  });
});
//**************view managers(admin)************************** */
app.get("/viewbmanagers", (req, res) => {
  const query =
    "SELECT m.*, b.Branch_Name FROM branch_manager m INNER JOIN branch b ON m.Branch_ID = b.Branch_ID";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching manager data:", err);
      return res.status(500).json({ error: "Failed to fetch manager data" });
    }
    res.status(200).json(results);
  });
});
/*************************branch dropdown */
app.get("/branches", (req, res) => {
  const query = "SELECT Branch_ID, Branch_Name FROM branch";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching branches:", err);
      return res.status(500).json({ error: "Failed to fetch branches" });
    }
    res.status(200).json(results);
  });
});
//*********************************** */
app.get("/supply_details", (req, res) => {
  const sql = `
  SELECT
    s.Supply_ID, s.Supplier_ID, su.Name, s.Supply_Date, s.Payment, si.Spice_ID, si.Quantity, si.Value, s.Payment_Status
  FROM
    supply s
  INNER JOIN
    supply_item si ON s.Supply_ID = si.Supply_ID
  INNER JOIN
    supplier su ON s.Supplier_ID = su.Supplier_ID
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error retrieving supply details:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err });
    }
    return res.json(result);
  });
});
//********************************************** */
app.get("/customer_orders", (req, res) => {
  const sql = `SELECT customer_order.Order_ID, customer_order.Customer_ID, accept_order.Payment, accept_order.Payment_Status, customer_order.Order_Date, customer_order.Deliver_Date, customer.Name, customer.Contact_Number,
  GROUP_CONCAT(CONCAT_WS(' - ', spice.Spice_Name, order_spice.Quantity, order_spice.Value) SEPARATOR ',\n') as 'Product Details'
FROM customer_order
INNER JOIN customer ON customer_order.Customer_ID = customer.Customer_ID
LEFT JOIN order_spice ON customer_order.Order_ID = order_spice.Order_ID
LEFT JOIN accept_order ON customer_order.Order_ID = accept_order.Order_ID
LEFT JOIN spice ON order_spice.Spice_ID = spice.Spice_ID
WHERE customer_order.Accept_Status = 1
GROUP BY customer_order.Order_ID;`;

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Query result:", data);
    return res.json({ orders: data });
  });
});

// Update payment status
app.put("/approved_payments/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  const paymentStatus = req.body.Payment_Status;

  const sql = `UPDATE accept_order SET Payment_Status = ? WHERE Order_ID = ?`;

  db.query(sql, [paymentStatus, orderId], (err, result) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Payment status updated:", result);
    return res.json({ message: "Payment status updated" });
  });
});

//*********************View Pending Orders */
app.get("/pending_customer_orders", (req, res) => {
  const sql = `SELECT customer_order.Order_ID, customer_order.Customer_ID, customer_order.Order_Date, customer_order.Deliver_Date, customer.Name, customer.Contact_Number,
    GROUP_CONCAT(CONCAT_WS(' - ', spice.Spice_Name, order_spice.Quantity, order_spice.Value) SEPARATOR ',\n') as 'Product Details',
    SUM(order_spice.Value) as 'Total Value'
  FROM customer_order
  INNER JOIN customer ON customer_order.Customer_ID = customer.Customer_ID
  LEFT JOIN order_spice ON customer_order.Order_ID = order_spice.Order_ID
  LEFT JOIN spice ON order_spice.Spice_ID = spice.Spice_ID
  WHERE customer_order.Accept_Status = 10
  GROUP BY customer_order.Order_ID;`;

  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    console.log("Query result:", data);
    return res.json({ orders: data });
  });
});

//Process Ordre
app.put('/process_order/:orderId', (req, res) => {
  const { orderId } = req.params;
  const { Process } = req.body;

  if (Process === undefined || Process === null) {
    return res.status(400).json({ error: "Process status is required" });
  }

  const sqlUpdateProcess = `
    UPDATE customer_order
    SET Process = ?
    WHERE Order_ID = ?
  `;
  db.query(sqlUpdateProcess, [Process, orderId], (err, results) => {
    if (err) {
      console.error('Error updating process status:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log('Process status updated:', results);
    res.json({ message: 'Process status updated successfully' });
  });
});



//Approve or decline pending orders
//************************************ */
app.put("/Approval_orders/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  const { Accept_Status } = req.body;

  if (Accept_Status === undefined || Accept_Status === null) {
    return res.status(400).json({ error: "Accept_Status is required" });
  }

  const sqlGetPayment = `
    SELECT SUM(Value) AS TotalPayment
    FROM order_spice
    WHERE Order_ID = ?
  `;

  db.query(sqlGetPayment, [orderId], (err, paymentResults) => {
    if (err) {
      console.error("Error calculating payment:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const totalPayment = paymentResults[0].TotalPayment;

    const updateOrder = () => {
      const sqlUpdateOrder = `
        UPDATE customer_order
        SET Accept_Status = ?
        WHERE Order_ID = ?
      `;
      db.query(sqlUpdateOrder, [Accept_Status, orderId], (err, orderResults) => {
        if (err) {
          console.error("Error updating order:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("Order updated:", orderResults);
        return res.json({ message: "Order updated successfully" });
      });
    };

    if (Accept_Status === 1) {
      const sqlGetOrderedQuantities = `
        SELECT Spice_ID, Quantity
        FROM order_spice
        WHERE Order_ID = ?
      `;
      db.query(sqlGetOrderedQuantities, [orderId], (err, quantitiesResults) => {
        if (err) {
          console.error("Error fetching ordered quantities:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Fetch current stock levels and check if there is sufficient stock
        const stockCheckPromises = quantitiesResults.map((row) => {
          const sqlCheckStock = `
            SELECT Stock
            FROM spice
            WHERE Spice_ID = ?
          `;
          return new Promise((resolve, reject) => {
            db.query(sqlCheckStock, [row.Spice_ID], (err, stockResults) => {
              if (err) {
                console.error(`Error fetching stock for Spice_ID ${row.Spice_ID}:`, err);
                reject(err);
              } else {
                if (stockResults[0].Stock >= row.Quantity) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              }
            });
          });
        });

        Promise.all(stockCheckPromises).then((stockCheckResults) => {
          if (stockCheckResults.every((result) => result)) {
            // Reduce stock in the spice table for each ordered spice
            const updateStockPromises = quantitiesResults.map((row) => {
              const sqlUpdateStock = `
                UPDATE spice
                SET Stock = Stock - ?
                WHERE Spice_ID = ?
              `;
              return new Promise((resolve, reject) => {
                db.query(sqlUpdateStock, [row.Quantity, row.Spice_ID], (err, stockUpdateResults) => {
                  if (err) {
                    console.error(`Error updating stock for Spice_ID ${row.Spice_ID}:`, err);
                    reject(err);
                  } else {
                    console.log(`Stock updated for Spice_ID ${row.Spice_ID}:`, stockUpdateResults);
                    resolve(stockUpdateResults);
                  }
                });
              });
            });

            Promise.all(updateStockPromises)
              .then(() => {
                const sqlInsertApproved = `
                  INSERT INTO accept_order (Order_ID, Payment)
                  VALUES (?, ?)
                `;
                db.query(sqlInsertApproved, [orderId, totalPayment], (err, insertResults) => {
                  if (err) {
                    console.error("Error inserting into accept_order:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                  }
                  console.log("Record inserted into accept_order:", insertResults);
                  updateOrder();
                });
              })
              .catch((err) => res.status(500).json({ error: "Error updating stock", details: err }));
          } else {
            return res.status(400).json({ error: "Insufficient stock for one or more items" });
          }
        });
      });
    } else {
      updateOrder();
    }
  });
});



// spice availability
app.get("/viewspice", (req, res) => {
  const query = "SELECT * FROM spice";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching spices:", err);
      return res.status(500).json({ error: "Failed to fetch spice" });
    }
    res.status(200).json(results);
  });
});
//--------------------------------------------deactivate spice

app.put("/toggleProductStatus/:id/:status", (req, res) => {
  const { id, status } = req.params;
  console.log(`Attempting to toggle product status for product with ID: ${id}`);

  // Define SQL query based on the status parameter
  const sql =
    status === "activate"
      ? "UPDATE spice SET Active_Status = 1 WHERE Spice_ID = ?"
      : "UPDATE spice SET Active_Status = 0 WHERE Spice_ID = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      res.status(500).send({ error: "Database query failed", details: err });
    } else if (result.affectedRows === 0) {
      console.warn(`Product with ID: ${id} not found`);
      res.status(404).send({ error: "Product not found" });
    } else {
      const action = status === "activate" ? "activated" : "deactivated";
      console.log(`Product with ID: ${id} ${action} successfully`);
      res.send({ success: true });
    }
  });
});

//edit spice------------------------------------------------------------------------

app.put("/editspice/:id", (req, res) => {
  const spiceId = req.params.id;
  const editedSpice = req.body; // Assuming the edited spice data is sent in the request body

  // Prepare SQL query to update the spice with the given ID
  const sql = `UPDATE spice SET Spice_Name = ?,  Buying_Price = ?, Selling_Price = ? WHERE Spice_ID = ?`;
  const values = [
    editedSpice.Spice_Name,
    editedSpice.Buying_Price,
    editedSpice.Selling_Price,
    spiceId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      res.status(500).send({ error: "Database query failed", details: err });
    } else if (result.affectedRows === 0) {
      console.warn(`Spice with ID: ${spiceId} not found`);
      res.status(404).send({ error: "Spice not found" });
    } else {
      console.log(`Spice with ID: ${spiceId} updated successfully`);
      res.status(200).send({ success: true });
    }
  });
});

//*****************************Add Spice */
app.post("/addspice", (req, res) => {
  const newSpice = req.body; // Assuming the new spice data is sent in the request body

  // Prepare SQL query to insert the new spice into the database
  const sql =
    "INSERT INTO spice (Spice_Name, Buying_Price, Selling_Price) VALUES (?, ?, ?)";
  const values = [
    newSpice.Spice_Name,
    newSpice.Buying_Price,
    newSpice.Selling_Price,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      res.status(500).send({ error: "Database query failed", details: err });
    } else {
      console.log("New spice added successfully");
      res.status(200).send({ success: true });
    }
  });
});

//************************************************** */

app.post("/adspice", upload.single("Image"), (req, res) => {
  const newSpice = req.body; // Assuming the new spice data is sent in the request body
  const imagePath = req.file.path; // Get the path of the uploaded image

  // Prepare SQL query to insert the new spice into the database
  const sql =
    "INSERT INTO spice (Spice_Name, Buying_Price, Selling_Price, Image_Path) VALUES (?, ?, ?, ?)";
  const values = [
    newSpice.Spice_Name,
    newSpice.Buying_Price,
    newSpice.Selling_Price,
    imagePath,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      res.status(500).send({ error: "Database query failed", details: err });
    } else {
      console.log("New spice added successfully");
      res.status(200).send({ success: true });
    }
  });
});
//**************************************calendar */
app.get("/calendar_order", (req, res) => {
  const sql = `SELECT o.Order_ID, o.Deliver_Date, c.Company_Name, c.Name,
  GROUP_CONCAT(CONCAT(s.Spice_Name, ' - ', os.Quantity, ' - ', os.Value, ' ')) AS Products,
  SUM(os.Quantity * os.Value) AS Total_Value,
  SUM(os.Value) AS Total_Payment,
  o.Accept_Status AS Approval
FROM customer_order o
JOIN order_spice os ON os.Order_ID = o.Order_ID
JOIN spice s ON os.Spice_ID = s.Spice_ID
JOIN customer c ON o.Customer_ID = c.Customer_ID
GROUP BY o.Order_ID, o.Deliver_Date, c.Company_Name, c.Name`;
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      console.log("No orders found");
      return res.status(404).json({ error: "Orders not found" });
    }
    console.log("Query result:", data);
    return res.json({ orders: data });
  });
});

// Fetch customer details by ID

//-------------------------------------------------------------------------------------------------------

app.listen(8081, () => {
  console.log("listening...");
});
