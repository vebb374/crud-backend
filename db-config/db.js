const mysql = require("mysql");
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const dbConn = mysql.createConnection({
  host: "localhost",
  user: process.env.PASSWORD,
  password: "root",
  database: "sakila",
});
dbConn.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});
module.exports = dbConn;
