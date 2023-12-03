const express = require('express');
const path = require('path');
const login = require('./login');
const multer = require('multer');
const sessionMiddleware = require('./session');  // For handling file uploads
const connection = login.connection;
const facultyUpload = require('./facultyUpload');
const facultyPublications = require('./facultyPublications');
const Qusername = 'username';

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
      const allowedFileTypes = ['.pdf'];
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedFileTypes.includes(ext)) {
          cb(null, true);
      } else {
          cb(new Error('Only PDF files are allowed.'));
      }
  },
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);  // Use the session middleware

// ... (other routes)

app.use('/', facultyUpload);
app.use('/', facultyPublications);

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
      req.session.user = username;
      res.redirect(`/facultyHome`);
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

  const QQusername = req.session.user;  // Assuming you store the username in the session
  let sql = `SELECT * FROM \`aiml\`.\`eventRecords\` WHERE professor_id = '${QQusername}'`;

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

app.get('/viewPublications', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');

  res.sendFile(path.join(__dirname, 'public', 'viewPublications.js'));
});

app.get('/downloadEventsProof/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, decodeURIComponent(fileName));

  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).send('File not found');
    }
  });
});

app.get('/editRecords/:recordId', (req, res) => {
  const recordId = req.params.recordId;

  const QQusername = req.session.user;
  let sql = `SELECT * FROM \`aiml\`.\`eventRecords\` WHERE id = '${recordId}' AND professor_id = '${QQusername}'`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching record:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if the record is found
    if (result.length === 0) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    // Return the record as JSON
    res.json(result[0]);
  });
});

app.put('/api/editRecords/:recordId', upload.single('proofFileInput'), (req, res) => {
  const recordId = req.params.recordId;
  const QQusername = req.session.user;

  // Get the edited data from the request body
  const editedRecord = {
    event_type: req.body.eventTypeInput,
    event_date: req.body.eventDateInput,
    event_name: req.body.eventNameInput,
    location: req.body.locationInput,
    organizer: req.body.organizerInput,
    duration_minutes: req.body.durationInput,
    feedback: req.body.feedbackInput,
    // Add other fields for additional record details
  };

  // Check if a new proof file is uploaded
  if (req.file) {
    editedRecord.proof_file_path = req.file.path; // Assuming the file path is stored in the database
  }

  // Update the record in the database
  const sql = `UPDATE \`aiml\`.\`eventRecords\` SET ? WHERE id = ? AND professor_id = ?`;
  connection.query(sql, [editedRecord, recordId, QQusername], (err, result) => {
    if (err) {
      console.error("Error updating record:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if the record is updated successfully
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Record not found or you do not have permission to edit' });
      return;
    }

    res.json({ message: 'Record updated successfully' });
  });
});

app.get('/api/publication_records', (req, res) => {
  let sql = 'SELECT * FROM FacultyPublications WHERE 1=1'; // Initial query

  // Handle filters
  if (req.query.publicationType && req.query.publicationType !== 'none') {
    sql += ` AND PublicationType = '${req.query.publicationType}'`;
  }

  if (req.query.fromDate) {
    sql += ` AND PublicationDate >= '${req.query.fromDate}'`;
  }

  if (req.query.toDate) {
    sql += ` AND PublicationDate <= '${req.query.toDate}'`;
  }

  if (req.query.index && req.query.index !== 'none') {
    sql += ` AND IndexType = '${req.query.index}'`;
  }

  // Execute the SQL query
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching publication records:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

app.get('/editPublications/:publicationId', (req, res) => {
  const PublicationID = req.params.publicationId;

  const QQusername = req.session.user;
  let sql = `SELECT * FROM \`aiml\`.\`facultyPublications\` WHERE PublicationID = '${PublicationID}' AND FacultyID = '${QQusername}'`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching record:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if the record is found
    if (result.length === 0) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    // Return the record as JSON
    res.json(result[0]);
  });
});

app.put('/api/editPublications/:publicationId', upload.single('filePathInput'), (req, res) => {
  const publicationId = req.params.publicationId;

  // Get the edited data from the request body
  const editedPublication = {
    title: req.body.titleInput,
    chapter: req.body.chapterInput,
    PublicationDate: req.body.publicationDateInput,
    volume: req.body.volumeInput,
    IndexType: req.body.indexTypeInput,
    // Add other fields for additional publication details
  };

  // Check if a new file is uploaded
  if (req.file) {
    editedPublication.file_path = req.file.path; // Assuming the file path is stored in the database
  }

  // Update the publication in the database
  const sql = `UPDATE \`aiml\`.\`facultyPublications\` SET ? WHERE PublicationID = ?`;
  connection.query(sql, [editedPublication, publicationId], (err, result) => {
    if (err) {
      console.error("Error updating publication:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    // Check if the publication is updated successfully
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Publication not found' });
      return;
    }

    res.json({ message: 'Publication updated successfully' });
  });
});