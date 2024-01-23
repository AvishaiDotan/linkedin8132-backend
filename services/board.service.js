// auth.service.js

const fs = require('fs');
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';
const path = require('path');

// Assuming this script is in a directory like 'project/src'
const relativePath = '../db/users.json';
const absolutePath = path.resolve(__dirname, relativePath);


const readBoard = (req, res) => {
    try {
        // Assuming your JSON file contains user data
        const users = require('../db/users.json');
        res.status(200).json({ users });

    } catch (e) {
        console.log(e);
    }

};


module.exports = { readBoard };
