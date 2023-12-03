const express = require('express');
const multer = require('multer');
const path = require('path');
const login = require('./login');
const connection = login.connection;

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
    const QQusername = req.session.user;
    const facultyID = QQusername;
    const title = (req.body.PublicationType === 'books') ? req.body.BookTitle : req.body.JournalTitle;
    const chapter = (req.body.PublicationType === 'books') ? req.body.BookChapter : req.body.JournalChapter;
    const date = (req.body.PublicationType === 'books') ? req.body.BookDate : req.body.JournalDate;
    const index = (req.body.PublicationType === 'books') ? req.body.BookIndex : req.body.JournalIndex;
    const filePath = req.file.path;
    const PublicationType = req.body.PublicationType;
    console.log('File path:', filePath);
    const volume = (req.body.PublicationType === 'books') ? req.body.BookVolume : null;

    let insertQuery;

    if (req.body.PublicationType === 'books') {
        insertQuery = 'INSERT INTO FacultyPublications (FacultyID, Title, Chapter, PublicationDate, Volume, IndexType, FilePath, PublicationType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    } else if (req.body.PublicationType === 'journals') {
        insertQuery = 'INSERT INTO FacultyPublications (FacultyID, Title, Chapter, PublicationDate, IndexType, FilePath, PublicationType) VALUES (?, ?, ?, ?, ?, ?, ?)';
    }
    insertQuery = 'INSERT INTO FacultyPublications (FacultyID, Title, Chapter, PublicationDate, Volume, IndexType, FilePath, PublicationType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(
        insertQuery,
        [facultyID, title, chapter, date, volume, index, filePath, PublicationType],
        (err, results) => {
            if (err) {
                console.error('Error executing insert query:', err);
                res.status(500).send('Error inserting data into the database');
            } else {
                console.log('Data inserted into the database');
                res.send('File uploaded successfully! <a href="/facultyHome.html">Go to Home</a>');
            }
        }
    );
});

module.exports = router;
