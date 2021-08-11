const mongoose = require('mongoose');
const express = require('express');
const logger = require('morgan');
var jwt = require('jsonwebtoken');
const dbConfig = require('./config/database.js');
const todo = require('./routes/todo.js');
const users = require('./routes/users.js');
const PORT = process.env.PORT || 3000; // port the server is running on

const app = express();

// connect to database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log("failed to connect, exiting process");
        process.exit();
    } else {
        console.log("successfully connected to database");
    }
});

// logging, parsing incoming requests
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// set base route at localhost:3000
app.get('/', (req, res) => {
    res.json({ "message": "todo api" });
});

// login endpoint logic
app.set('secretKey', 'nodeRestApi');

const validateUser = (req, res, next) => {
    jwt.verify(req.headers['x-access-token'],
        req.app.get('secretKey'), (err, decoded) => {
            if (err) {
                err.status = 401;
                next(err);
            } else {
                //add user id to request
                req.body.userId = decoded.id;
                next();
            }
        });
}

// connect to routes
app.use('/users', users);
app.use('/todolist', validateUser, todo);

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    next(err);
});

app.use((err, req, res, next) => {
    if (err.status === 400) {
        res.json({ message: "400: bad request" });
    } else if (err.status === 401) {
        res.json({ message: "401: failed to authenticate with the server" });
    } else if (err.status === 404) {
        res.json({ message: "404: not found" });
    } else {
        res.json({ message: "500: some error encountered on the server" });
    }
});

// connect to port 3000
app.listen(3000, () => {
    console.log(`Node server listening on port ${PORT}`);
});