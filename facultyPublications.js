const express = require('express');
const multer = require('multer');
const path = require('path');
const login = require('./login');
const connection = login.connection;

const router = express.Router();
const storage = multer.diskStorage({
    destination: 'Publicationsuploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname + '-' + uniqueSuffix);
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

router.post('/submitPublication', (req, res) => {
    console.log('Received form data:', req.body);
    console.log('Received file:', req.file);
    const publicationType = req.body.PublicationType;
    const proofFieldName = (publicationType === 'books') ? 'bookProof' : 'journalProof';
    console.log('Publication type:', publicationType);
    console.log('Proof field name:', proofFieldName);

    upload.single(proofFieldName)(req, res, function (err) {
        if (err) {
            return res.status(400).send(err.message);
        }

        if (!req.file) {
            return res.status(400).send('No file was uploaded.');
        }

        // Extract form field values
        const PublicationID = req.body.PublicationID;
        const facultyID = req.body.FacultyID;
        const title = (publicationType === 'books') ? req.body.BookTitle : req.body.JournalTitle;
        const chapter = (publicationType === 'books') ? req.body.BookChapter : req.body.JournalChapter;
        const date = (publicationType === 'books') ? req.body.BookDate : req.body.JournalDate;
        const index = (publicationType === 'books') ? req.body.BookIndex : req.body.JournalIndex;
        const filePath = req.file.path;

        // Define the insert query
        const insertQuery = 'INSERT INTO FacultyPublications (PublicationID, FacultyID, Title, Chapter, PublicationDate, Index, FilePath) VALUES (?, ?, ?, ?, ?, ?, ?)';

        // Execute the insert query
        connection.query(insertQuery, [PublicationID, facultyID, title, chapter, date, index, filePath], (err, results) => {
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
});

module.exports = router;

router.post('/test', (req, res) => {
    console.log('Received a POST request at /test');
    res.send('OK');
});

module.exports = router;