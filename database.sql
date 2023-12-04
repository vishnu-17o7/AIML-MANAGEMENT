create database AIML;
use AIML;

CREATE TABLE login (
    facultyID BIGINT NOT NULL PRIMARY KEY,
    password VARCHAR(50) NOT NULL,
    type VARCHAR(30)
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
