import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import moment from 'moment';

const app= express();

app.use(cors());
app.use(express.json());

const db= mysql.createConnection({
host:"localhost",
user:"root",
password:"",
database:"spicemart"
})

//--------------------------------------------------------------------------------------------------
//login
app.post('/login',(req,res)=>{
    const sql="SELECT * FROM user WHERE User_Name=? and Password=? ";
    
    db.query(sql, [req.body.User_Name, req.body.Password], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.length > 0) {
        const user = {
          User_ID: results[0].User_ID,
          User_Name: results[0].User_Name,
          User_Type: results[0].User_Type
        };
        console.log(user.User_Type);
        return res.json({ status: "success", user });
      } else {
        return res.json({ status: "no record" });
      }
    });
  });

//-------------------customer local storage------------------------------------

app.get('/customer/:userId', (req, res) => {
  const userId = req.params.userId;  
  const sql = "SELECT Customer_ID FROM customer WHERE User_ID = ?";
  
  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0) return res.status(404).json({ error: "Customer not found" });
    return res.json({ customerId: data[0].Customer_ID });
  });
});
//-------------------supplier Local Storage
app.get('/supplier/:userId', (req, res) => {
  const userId = req.params.userId;  
  const sql = "SELECT Supplier_ID FROM supplier WHERE User_ID = ?";
  
  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0) return res.status(404).json({ error: "Customer not found" });
    return res.json({ customerId: data[0].Customer_ID });
  });
});
 
//-------------------BManager Local Storage
app.get('/branch_manager/:userId', async (req, res) => {
  const userId = req.params.userId;  
  const sql = "SELECT Manager_ID FROM branch_manager WHERE User_ID = ?";
  
  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0) return res.status(404).json({ error: "Customer not found" });
    return res.json({ customerId: data[0].Customer_ID });
  });
});




//************spices dropdown

app.get('/spice', (req, res) => {
  const sql = 'SELECT Spice_Id, Spice_Name FROM spice';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching Spices', err);
      res.status(500).json({ error: 'Failed to fetch Spices' });
    } else {
      res.json(result);
    }
  });
});
 

//--------------------------------------------------------------------------------------------------------
//Change Password
app.post('/change-password', (req, res) => {
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

///--------------------------------------------------------------------------------------------------
// Register User
app.post('/user', async (req, res) => {
  const { User_Name, User_Type, Password } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO user (User_Name, User_Type, Password) VALUES (?, ?, ?)',
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
    console.error('Error registering user:', err);
    res.status(500).send('Server error');
  }
});

//----------------------------------------------------------------------------------------------
// Register Branch Manager
app.post('/branch_manager', async (req, res) => {
  const { Name, Contact_Number, Email, Branch_Name } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO branch_manager (Name, Contact_Number, Email, Branch_Name, User_ID) VALUES (?, ?, ?, ?, LAST_INSERT_ID())',
      [Name, Contact_Number, Email, Branch_Name]
    );

    res.status(201).send("Branch manager registered successfully");
  } catch (err) {
    console.error('Error registering Manager:', err);
    res.status(500).send('Server error');
  }
});


//----------------------------------------------------------------------------------------------
// Register Customer
app.post('/customer', async (req, res) => {
  const { Company_Name,Name, Contact_Number, Email } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO customer(Company_Name, Name, Contact_Number, Email, User_ID) VALUES (?, ?, ?, ?, LAST_INSERT_ID())',
      [Company_Name ,Name, Contact_Number, Email]
    );

    res.status(201).send("Customer registered successfully");
  } catch (err) {
    console.error('Error registering Customer:', err);
    res.status(500).send('Server error');
  }
});


//-------------------------------------------------------------------------------------------------------
//Supplier- Price Level
app.get('/spices', (req, res) => {
  const sql = 'SELECT * FROM spice';

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error retrieving spices' });
    } else {
      res.json(results);
    }
  });
});
//--------------Place Order-Customer Order
app.post('/place_order', async (req, res) => {
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

//---------------Payment-Customer view

app.get('/customer_order/:customerId', (req, res) => {
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
      console.error('Database query error:', err);  // Log error for debugging
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      console.log('No orders found for customer ID:', customerId);  // Log no data found
      return res.status(404).json({ error: "Orders not found" });
    }
    console.log('Query result:', data);  // Log the data for debugging
    console.log(data)
    return res.json({ orders: data });
  });
});

//---------Availability table
app.get('/check_stock', (req, res) => {
  const sql = 'SELECT Spice_Name, Selling_Price,Stock FROM spice';

  db.query(sql, (err, data) => {
    if (err) {
      console.error('Database query error:', err);  // Log error for debugging
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (data.length === 0) {
      console.log('No spices found');  // Log no data found
      return res.status(404).json({ error: "Spices not found" });
    }
    console.log('Query result:', data);  // Log the data for debugging
    return res.json({ spices: data });
  });
});

//********************get branch_manager userID************************** */

app.get('/find_branch_manager/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT Manager_ID, Branch_ID FROM branch_manager WHERE User_ID = ?";

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error retrieving branch manager:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Branch manager not found" });
    }
    return res.json(result[0]);
  });
});

// ------view supplier(branch manager)
app.get('/suppliers/:branchId', (req, res) => {
  const branchId = req.params.branchId;
  const sql = "SELECT * FROM supplier WHERE Branch_ID = ?";

  db.query(sql, [branchId], (err, result) => {
    if (err) {
      console.error("Error retrieving suppliers:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "No suppliers found for this branch" });
    }
    return res.json(result);
  });
});
//************register supplier******************** */
app.post('/suppliers', (req, res) => {
  const { Name, Contact_Number, Address1, Address2, Branch_ID, User_Name, Password } = req.body;

  // Validate required fields
  if (!Name || !Contact_Number || !Address1 || !Branch_ID || !User_Name || !Password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Insert into user table
    const userQuery = 'INSERT INTO user (User_Name, Password, User_Type) VALUES (?, ?, ?)';
    db.query(userQuery, [User_Name, Password, 'Supplier'], (err, userResult) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error adding user to database:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        });
      }

      const User_ID = userResult.insertId;

      // Insert into supplier table
      const supplierQuery = 'INSERT INTO supplier (Name, Contact_Number, Address1, Address2, Branch_ID, User_ID) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(supplierQuery, [Name, Contact_Number, Address1, Address2, Branch_ID, User_ID], (err, supplierResult) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error adding supplier to database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error committing transaction:', err);
              res.status(500).json({ error: 'Internal Server Error' });
            });
          }

          const newSupplier = {
            Supplier_ID: supplierResult.insertId,
            Name,
            Contact_Number,
            Address1,
            Address2,
            Branch_ID,
            User_ID
          };
          res.status(201).json(newSupplier);
        });
      });
    });
  });
});
 //****************** */

 app.put('/suppliers/:id', (req, res) => {
  const supplierId = req.params.id;
  const { Name, Contact_Number, Address1, Address2 } = req.body;

  // Validate required fields
  if (!Name || !Contact_Number || !Address1) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const updateQuery = `
    UPDATE supplier 
    SET Name = ?, Contact_Number = ?, Address1 = ?, Address2 = ? 
    WHERE Supplier_ID = ?
  `;

  db.query(updateQuery, [Name, Contact_Number, Address1, Address2, supplierId], (err, result) => {
    if (err) {
      console.error('Error updating supplier in database:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const updatedSupplier = {
      Supplier_ID: supplierId,
      Name,
      Contact_Number,
      Address1,
      Address2
    };

    res.status(200).json(updatedSupplier);
  });
});

//*****************************delete supplier */
// DELETE endpoint to delete a supplier by ID
app.delete('/suppliers/:id', (req, res) => {
  const supplierId = req.params.id;

  // Start a transaction to ensure atomicity
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // Delete supplier from the supplier table
    const deleteSupplierQuery = 'DELETE FROM supplier WHERE Supplier_ID = ?';
    db.query(deleteSupplierQuery, [supplierId], (err, supplierResult) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error deleting supplier from database:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        });
      }

      // Delete user from the user table
      const deleteUserQuery = 'DELETE FROM user WHERE User_ID = (SELECT User_ID FROM supplier WHERE Supplier_ID = ?)';
      db.query(deleteUserQuery, [supplierId], (err, userResult) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error deleting user from database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          });
        }

        // Commit the transaction if both deletions are successful
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error committing transaction:', err);
              res.status(500).json({ error: 'Internal Server Error' });
            });
          }

          // Return success response if deletion is successful
          res.status(200).json({ message: 'Supplier and associated user deleted successfully' });
        });
      });
    });
  });
});
//*********get supply details(branch manager)********************* */

app.get('/supply_details/:branchId', (req, res) => {
  const branchId = req.params.branchId;
  const sql = `
  SELECT
  s.Supply_ID, s.Supplier_ID, s.Date, s.Payment, si.Spice_ID, si.Quantity, si.Value, s.Payment_Status
FROM
  supply s
INNER JOIN
  supply_item si ON s.Supply_ID = si.Supply_ID
INNER JOIN
  supplier su ON s.Supplier_ID = su.Supplier_ID
WHERE
  su.Branch_ID = ?



  `;

  db.query(sql, [branchId], (err, result) => {
    if (err) {
      console.error("Error retrieving supply details:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err });
    }
    return res.json(result);
  });
});

//**************************************** */
app.put('/update_payment_status/:supplyId', (req, res) => {
  const supplyId = parseInt(req.params.supplyId);
  const { Payment_Status } = req.body;

  const sql = `UPDATE supply SET Payment_Status = ? WHERE Supply_ID = ?`;

  db.query(sql, [Payment_Status, supplyId], (err, result) => {
    if (err) {
      console.error("Error updating payment status:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Supply detail not found' });
    }

    res.json({ success: true, message: 'Payment status updated successfully' });
  });
});
 //************************************ */ 

 app.put('/reset_payment_status/:supplyId', (req, res) => {
  const supplyId = parseInt(req.params.supplyId);

  const sql = `UPDATE supply SET Payment_Status = 0 WHERE Supply_ID = ?`;

  db.query(sql, [supplyId], (err, result) => {
    if (err) {
      console.error("Error resetting payment status:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Supply detail not found' });
    }

    res.json({ success: true, message: 'Payment status reset successfully' });
  });
});

//************************************ */
// Express route to delete a supply record
app.delete('/delete_supply/:supplyId', (req, res) => {
  const supplyId = req.params.supplyId;
  const sql = `DELETE FROM supply WHERE Supply_ID = ?`;

  db.query(sql, [supplyId], (err, result) => {
    if (err) {
      console.error("Error deleting supply:", err);
      return res.status(500).json({ error: "Internal Server Error", details: err });
    }
    return res.json({ message: "Supply deleted successfully" });
  });
});


//-------------------------------------------------------------------------------------------------------

app.listen(8081,()=>{
    console.log ("listening...")
})
