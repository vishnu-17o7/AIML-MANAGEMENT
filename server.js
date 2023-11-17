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
  let sql = "SELECT * FROM `aiml`.`attendance_records` WHERE 1";

  // Handle filters
  if (req.query.fromDate) {
      sql += ` AND event_date >= '${req.query.fromDate}'`;
  }

  if (req.query.toDate) {
      sql += ` AND event_date <= '${req.query.toDate}'`;
  }

  if (req.query.eventTypes) {
    const eventTypes = Array.isArray(req.query.eventTypes) ? req.query.eventTypes : [req.query.eventTypes];
      sql += ` AND event_type IN (${eventTypes.join(",")})`;
  }

  // Handle sorting
  if (req.query.sortByDate === "asc") {
      sql += " ORDER BY event_date ASC";
  } else if (req.query.sortByDate === "desc") {
      sql += " ORDER BY event_date DESC";
  }
  console.log(sql);
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
