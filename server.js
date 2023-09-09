const express = require('express');
const path = require('path');
const login = require('./login'); // Import the login file/module

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
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
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
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
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
      } else {
        res.send('Registration failed');
      }
    });
  });

// Handle GET request for the registration page
app.get('/registerpage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Handle GET request for the login page
app.get('/loginpage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
