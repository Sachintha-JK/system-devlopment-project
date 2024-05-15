import express from 'express';
import cors from 'cors';
import mysql from 'mysql';

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

//------------------------------------------------------------------------

app.get('/customer/:userId', (req, res) => {
  const userId = req.params.userId;  
  const sql = "SELECT Customer_ID FROM customer WHERE User_ID = ?";
  
  db.query(sql, [userId], (err, data) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (data.length === 0) return res.status(404).json({ error: "Customer not found" });
    return res.json({ customerId: data[0].Customer_ID });
  });
});

//------------------------------------------
app.get('/customer_order/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const sql = `SELECT o.Order_ID, o.Order_Date, o.payment,
  GROUP_CONCAT(CONCAT(s.Spice_Name, ' - ', os.Quantity, '  - ', os.Value, ' ')) AS Spices,
  SUM(os.Quantity * os.Value) AS Total_Value
FROM customer_order o
JOIN order_spice os ON os.Order_ID = o.Order_ID
JOIN spice s ON os.Spice_ID = s.Spice_ID
WHERE o.Customer_ID = ?
GROUP BY o.Order_ID, o.Order_Date, o.payment
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


//-----------------------------------------------------------------------------------------------------------
// Register Supplier
app.post('/supplier', async (req, res) => {
  const { Name, Address1, Address2, Contact_Number, Branch_Name } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO supplier (Name, Address1, Address2, Contact_Number, Branch_Name, User_ID) VALUES (?, ?, ?, ?, ?, LAST_INSERT_ID())',
      [Name, Address1, Address2, Contact_Number, Branch_Name]
    );

    res.status(201).send("Supplier registered successfully");
  } catch (err) {
    console.error('Error registering supplier:', err);
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


//-------------------------------------------------------------------------------------------------------

app.listen(8081,()=>{
    console.log ("listening...")
})
