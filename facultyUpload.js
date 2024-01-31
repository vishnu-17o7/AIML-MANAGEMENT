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

// Handle the GET request for the uploading data 
router.post('/submit', upload.single('proof'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }
    const QQusername = req.session.user;
    const professorId = QQusername;
    const eventType = req.body.event_type;
    const eventDate = req.body.event_date;
    const eventName = req.body.event_name;
    const location = req.body.location;
    const organizer = req.body.organizer;
    const durationMinutes = req.body.duration_minutes;
    const feedback = req.body.feedback;

    const insertQuery = 'INSERT INTO eventRecords (professor_id, event_type, event_date, event_name, location, organizer, duration_minutes, feedback, proof_file_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    connection.query(insertQuery, [professorId, eventType, eventDate, eventName, location, organizer, durationMinutes, feedback, req.file.path], (err, results) => {
        if (err) {
            console.error('Error executing insert query:', err);
            res.status(500).send('Error inserting data into the database');
        } else {
            console.log('Data inserted into the database');
            res.send('File uploaded successfully! <a href="/facultyHome.html">Go to Home</a>');
        }
    });
});

module.exports = router;
