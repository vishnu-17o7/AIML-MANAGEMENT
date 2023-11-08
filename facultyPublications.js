const express = require('express');
const multer = require('multer');
const path = require('path');
const login = require('./login');
const connection = login.connection; // Import the connection from the login.js file

const router = express.Router();
const storage = multer.diskStorage({
    destination: 'Publicationsuploads/', // Change the destination folder to 'Publicationsuploads'
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

router.post('/submitPublication', upload.single('proof'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }

    // Extract form field values
    const PublicationID = req.body.PublicationID;
    const facultyID = req.body.FacultyID;
    const title = req.body.Title;
    const publicationDate = req.body.PublicationDate;
    const filePath = req.file.path;

    // Define the insert query
    const insertQuery = 'INSERT INTO FacultyPublications (PublicationID, FacultyID, Title, PublicationDate, FilePath) VALUES (?, ?, ?, ?, ?)';

    // Execute the insert query
    connection.query(insertQuery, [PublicationID, facultyID, title, publicationDate, filePath], (err, results) => {
        if (err) {
            console.error('Error executing insert query:', err);
            // Handle the error, e.g., return an error response
            res.status(500).send('Error inserting data into the database');
        } else {
            // Insert was successful
            console.log('Data inserted into the database');
            // Respond to the client with a success message or redirection
            res.send('File uploaded successfully! <a href="/facultyHome.html">Go to Home</a>');
        }
    });
});

module.exports = router;
