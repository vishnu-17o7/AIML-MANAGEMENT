const session = require('express-session');

//Creating a browser session
module.exports = session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
});
