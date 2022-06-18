DROP DATABASE IF EXISTS `authDB`;

CREATE DATABASE IF NOT EXISTS `authDB` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `authDB`;

CREATE TABLE user(
    id BIGINT(200) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    googleId VARCHAR(255) DEFAULT NULL,
    email VARCHAR(255) DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    token VARCHAR(255) NOT NULL,
    created DATETIME NOT NULL,
    isActive BOOLEAN NOT NULL,
    isDelete BOOLEAN NOT NULL,
    CONSTRAINT user_pk PRIMARY KEY(id)
);

CREATE TABLE application(
    id BIGINT(200) NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    apiKey VARCHAR(255) NOT NULL,
    redirect_uri VARCHAR(255) NOT NULL,
    created DATETIME NOT NULL,
    updated DATETIME NOT NULL, 
    isActive BOOLEAN NOT NULL,
    isDelete BOOLEAN NOT NULL,
    CONSTRAINT application_pk PRIMARY KEY(id)
);

CREATE TABLE auth(
    id BIGINT(200) NOT NULL AUTO_INCREMENT,
    user VARCHAR(255) NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    redirect_uri VARCHAR(255) NOT NULL,
    response_type VARCHAR(10) NOT NULL,
    code VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    created DATETIME NOT NULL,
    CONSTRAINT auth_pk PRIMARY KEY(id)
);