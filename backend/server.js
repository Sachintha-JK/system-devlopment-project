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


//login
app.post('/login',(req,res)=>{
    const sql="SELECT * FROM user WHERE User_Name=? and Password=? ";
    
    db.query(sql,[req.body.User_Name, req.body.Password],(err,data)=>{
        if(err)return res.json("Error");
        if(data.length>0){
            console.log(data[0].User_Type);
            return res.json({status: "success", userType: data[0].User_Type})
        } else{
            return res.json({status: "no record"})
        }
    } )   
        
})


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




app.listen(8081,()=>{
    console.log ("listening...")
})
