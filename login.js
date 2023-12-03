const mysql = require('mysql2');

//Creating connection with the mysql database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'AIML'
});

//Performing login authentication
function authenticateUser(username, password, callback) {
  const query = 'SELECT * FROM login WHERE facultyID = ? AND password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      callback(err, false, username);
      return;
    }

    if (results.length > 0) {
      callback(null, true, username);
    } else {
      callback(null, false, username);
    }
  });
}

//Registering user in the login database
function registerUser(username, password, type, callback) {
  const query = 'INSERT INTO login (facultyID, password, type) VALUES (?, ?, ?)';
  connection.query(query, [username, password, type], (err) => {
    if (err) {
      console.error('Error executing query:', err);
      callback(err, false);
      return;
    }
    callback(null, true);
  });
}

//Importing module for use in other files
module.exports = {
  authenticateUser,
  registerUser,
  connection
};
