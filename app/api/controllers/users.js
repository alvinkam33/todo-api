const userModel = require('../models/users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    create: (req, res, next) => {
        // validation (name, email, password must be filled)
        if (!req.body.name || !req.body.email || !req.body.password) {
            return res.status(400).send({
                message: "bad request: name, email, password must be filled"
            });
        }

        // create new user
        userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }, (err, user) => {
            if (err) {
                next(err);
            }
            else {
                res.json({ 
                    message: "user added successfully", 
                    data: user 
                });
            }
        });
    },

    // authenticate user on login
    authenticate: (req, res, next) => {
        userModel.findOne({
            email: req.body.email
        }, (err, userInfo) => {
            if (err) {
                next(err);
            } else {
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' });
                    res.json({ 
                        status: "success", 
                        message: "user found", 
                        data: { user: userInfo, token: token } 
                    });
                } else {
                    res.json({ 
                        status: "error", 
                        message: "invalid email/password" 
                    });
                }
            }
        });
    },
}