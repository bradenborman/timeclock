-- Auto-create tables on startup if they don't exist
-- Spring Boot will execute this on startup when spring.sql.init.mode is set

CREATE TABLE IF NOT EXISTS Users (
    userId VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(20) NULL,
    email VARCHAR(255) NULL,
    physicalMailingAddress VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS Shifts (
    shiftId INT PRIMARY KEY AUTO_INCREMENT,
    userId VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    clockIn TIMESTAMP NOT NULL,
    clockOut TIMESTAMP NULL,
    timeWorked VARCHAR(255) NULL,
    FOREIGN KEY (userId) REFERENCES Users(userId)
);

CREATE TABLE IF NOT EXISTS Notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    value TEXT NOT NULL,
    dateSubmitted TIMESTAMP NOT NULL
);
