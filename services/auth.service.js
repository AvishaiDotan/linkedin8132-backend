// auth.service.js

const fs = require('fs');
const jwt = require('jsonwebtoken');
const secretKey = 'yourSecretKey';
const path = require('path');

// Assuming this script is in a directory like 'project/src'
const relativePath = '../db/users.json';
const absolutePath = path.resolve(__dirname, relativePath);

// Function to authenticate user
const login = (req, res) => {
    try {
        // Assuming your JSON file contains user data
        const users = require('../db/users.json');
        // Extract userId and password from the request body
        const { userId, password } = req.body;

        // const currUser = 
        
        // Check if the provided userId and password match the data in the JSON file
        const user = users.find(u => +u.userId === +userId) //users.find(u => +u.userId === +userId && u.password === password);
        if (user) {
            const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
            const cleanUser = { ...user, password: null };
            // If credentials are valid, set a cookie for validation and authorization
            res.cookie('linkedin8132', token, { httpOnly: true });
            res.status(200).json({ token, cleanUser });
        } else {
            // If credentials are not valid, send an error response
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (e) {
        console.log(e);
    }

};

const put = (req, res) => {
    try {
        // Assuming your JSON file contains user data
        const users = require('../db/users.json');
        // Extract userId and password from the request body
        const { user } = req.body;
        // Check if the provided userId and password match the data in the JSON file
        const currUserIdx = users.findIndex(u => +u.id === +user.id);
        user.password = users[currUserIdx].password;
        users.splice(currUserIdx, 1)

        users.push(user)
        const updatedData = { users };

        // Write the updated data back to the file
        fs.writeFileSync(absolutePath, JSON.stringify(updatedData, null, 2), 'utf-8');

        res.status(200).json({ isUpdated: true });

    } catch (e) {
        console.log(e);
    }

};

const validateToken = (req, res) => {
    try {
        // Verify the token using the secret key
        const { token } = req.body
        if (!token) {
            res.status(200).json({ isValid: false });
            return;
        }
        const isValid = validate(token, secretKey);
        res.status(200).json({ isValid });
    } catch (error) {
        // Token verification failed
        console.error('Token validation error:', error.message);
        return null;
    }
}

const isValidToken = (token) => {
    return validate(token, secretKey);
}

function validate(token, secretKey) {
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (error) {
        // Token verification failed
        console.error('Token validation error:', error.message);
        return null;
    }
}

module.exports = { login, validateToken, put, isValidToken };
