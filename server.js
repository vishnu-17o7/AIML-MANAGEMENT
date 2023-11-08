const express = require('express');
const path = require('path');
const login = require('./login');
const connection = login.connection; // Import the login file/module
const facultyUpload = require('./facultyUpload');
const facultyPublications = require('./facultyPublications');


const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'log.html'));
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    login.authenticateUser(username, password, (err, isAuthenticated) => {
      if (err) {
        console.error('Error during authentication:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      if (isAuthenticated) {
        res.redirect('/facultyHome');
      } else {
        res.send('Login failed');
      }
    });
 });

  app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const type = req.body.userType;
    login.registerUser(username, password, type, (err, isRegistered) => {
      if (err) {
        console.error('Error during registration:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      if (isRegistered) {
        res.sendFile(path.join(__dirname, 'public', 'log.html'));
      } else {
        res.send('Registration failed');
      }
    });
  });

// Handle GET request for the registration page
app.get('/registerpage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'log.html'));
});

// Handle GET request for the login page
app.get('/loginpage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'log.html'));
});

app.use('/', facultyUpload);
app.use('/', facultyPublications);

app.get('/facultyHome', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'facultyHome.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get("/api/attendance_records", (req, res) => {
  const sql = "SELECT * FROM `aiml`.`attendance_records`";

  connection.query(sql, (err, results) => {
      if (err) {
          console.error("Error fetching records:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
      }
      res.json(results);
  });
});

app.get('/viewRecords', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');

  res.sendFile(path.join(__dirname, 'public', 'viewRecords.js'));
});
