create database AIML;
use AIML;

CREATE TABLE login (
    facultyID BIGINT NOT NULL PRIMARY KEY,
    password VARCHAR(50) NOT NULL,
    type VARCHAR(30)
);

CREATE TABLE eventRecords (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    professor_id BIGINT NOT NULL,
    event_type VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    organizer VARCHAR(255),
    duration_minutes INT,
    feedback TEXT,
    proof_file_path VARCHAR(255) NOT NULL
);


CREATE TABLE facultyPublications (
    PublicationID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    FacultyID BIGINT NOT NULL,
    Title VARCHAR(255),
    Chapter VARCHAR(255),
    PublicationDate DATE,
    Volume VARCHAR(255),
    IndexType VARCHAR(255),
    FilePath VARCHAR(255),
    PublicationType VARCHAR(255),
    FOREIGN KEY (FacultyID) REFERENCES login(facultyID)
);
