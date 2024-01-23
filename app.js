// const fs = require('fs');
// const path = require('path');
// const data = require('./db/usersFieldOfInterst.json');
// const relativePath = './db/usersFieldOfInterst.json';
// const absolutePath = path.resolve(__dirname, relativePath);

// // Read JSON data from a file
// const readFile = (filePath) => {
//   try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     console.error('Error reading the file:', error);
//     return null;
//   }
// };

// // Write JSON data to a file
// const writeFile = (filePath, data) => {
//   try {
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
//     console.log('File written successfully:', filePath);
//   } catch (error) {
//     console.error('Error writing to the file:', error);
//   }
// };

// // Your file paths
// const inputFilePath = absolutePath//'input.json';
// const outputFilePath = absolutePath//'output.json';

// // Read JSON data from the input file
// const jsonData = data;
// console.log(data);
// if (jsonData) {
//   // Process each object in the array
//   jsonData.forEach((obj) => {
//     obj.phoneNumber = `0${obj.phoneNumber}`
//   });

//   // Write the modified data back to the output file
//   console.log(jsonData);
//   writeFile(outputFilePath, jsonData);
// }



const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { login, validateToken, put, isValidToken } = require('./services/auth.service');
const { readBoard } = require('./services/board.service');
const app = express();
const port = 3000;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'http://127.0.0.1:3030',
            'http://localhost:3030',
        ],
        credentials: true,
        exposedHeaders: ["set-cookie"],
    }
    app.use(cors(corsOptions))
}
app.use(cookieParser());
app.use(express.json())
const validateCookie = (req, res, next) => {
    if (req.path === '/' || req.path === '/login' || req.path === '/validateToken') {
        next();
        return;
    }


    if (isValidToken(req.headers.authorization)) {
        next();
    } else {
        res.status(401).send('Invalid');
    }
};

app.use(validateCookie);

app.post('/login', login);
app.post("/validateToken", validateToken)
app.put("/user", put)
app.get("/board", readBoard)

app.get('/protected-endpoint', (req, res) => {
    res.send('Valid');
});

app.get('/', (req, res) => {
    res.send('Welcome to the root endpoint. No cookie validation required.');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
