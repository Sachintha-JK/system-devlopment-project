import db from '../config/db.js'; // Assuming you have a db.js file that exports the database connection

export const loginFunction = async (req, res) => {
  const { User_Name, Password } = req.body;

  const sql = "SELECT * FROM user WHERE User_Name=? and Password=?";

  db.query(sql, [User_Name, Password], (err, results) => {
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
};

export default {
  loginFunction
};
