const express = require('express');
const multer = require('multer');
const path = require('path');
const login = require('./login');
const connection = login.connection;//Importing the connection from the login.js file

const router = express.Router();
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

router.post('/submit', upload.single('proof'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }

    // Extract form field values
    const professorId = req.body.professor_id;
    const eventType = req.body.event_type;
    const eventDate = req.body.event_date;
    const eventName = req.body.event_name;
    const location = req.body.location;
    const organizer = req.body.organizer;
    const durationMinutes = req.body.duration_minutes;
    const feedback = req.body.feedback;

    // Define the insert query
    const insertQuery = 'INSERT INTO attendance_records (professor_id, event_type, event_date, event_name, location, organizer, duration_minutes, feedback, proof_file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Execute the insert query
    connection.query(insertQuery, [professorId, eventType, eventDate, eventName, location, organizer, durationMinutes, feedback, req.file.path], (err, results) => {
        if (err) {
            console.error('Error executing insert query:', err);
            // Handle the error, e.g., return an error response
            res.status(500).send('Error inserting data into the database');
        } else {
            // Insert was successful
            console.log('Data inserted into the database');
            // Respond to the client with a success message or redirection
            res.send('File uploaded successfully! <a href="/">Go to Home</a>');
        }
    });
});

module.exports = router;
