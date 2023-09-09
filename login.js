const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'AIML'
});

function authenticateUser(username, password, callback) {
  const query = 'SELECT * FROM login WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      callback(err, false);
      return;
    }

    if (results.length > 0) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  });
}

function registerUser(username, password, type, callback) {
  const query = 'INSERT INTO login (username, password, type) VALUES (?, ?, ?)';
  connection.query(query, [username, password, type], (err) => {
    if (err) {
      console.error('Error executing query:', err);
      callback(err, false);
      return;
    }
    callback(null, true);
  });
}

module.exports = {
  authenticateUser,
  registerUser
};
