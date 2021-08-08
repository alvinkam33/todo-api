const express = require('express'); 
const logger = require('morgan');
const todo = require('./routes/todo.js');
const users = require('./routes/users.js');
const bodyParser = require('body-parser');
const mongoose = require('./config/database.js');
var jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 3000; // port the server is running on

const app = express();

app.set('secretKey', 'nodeRestApi');

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
 res.json({"message" : "todo api"});
});

const validateUser = (req, res, next) => {
    jwt.verify(req.headers['x-access-token'],
    req.app.get('secretKey'), (err, decoded) => {
        if (err) {
            res.json({status: "error", message: err.message, data: null});
        } else {
            //add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}

app.use('/users', users);
app.use('/todolist', validateUser, todo);

app.get('favicon.ico', (req, res) => {
    res.sendStatus(204);
});



app.use((req, res, next) => {
    let err = new Error('not found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err);

    if (err.status === 404) {
        res.status(404).json({message: "not found"});
    } else {
        res.status(500).json({message: "some error found"});
    }
});

app.listen(3000, () => { 
    console.log(`Node server listening on port ${PORT}`);
});