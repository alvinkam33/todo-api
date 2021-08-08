const todoModel = require('../models/todo.js');

module.exports = {
    create: (req, res, next) => {
        // validation (task and category must be filled) 
        if (!req.body.task || !req.body.category) {
            return res.status(400).send({
                message: "task and category must not be empty"
            });
        }

        // create todo item (completion will always start at default value false)
        todoModel.create({
            task: req.body.task,
            category: req.body.category,
            description: req.body.description || "n/a",
            completion: false
        }, (err) => {
            if (err) {
                next(err);
            } else {
                res.json({status: "sucess", message: "todo item added successfully", data: null});
            }
        })

        // save new item in db
        /*
        todo.save()
            .then(data => {
                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "an error occured while creating the todo item"
                });
            });
        */
    },

    // retrieve all todo items
    getAll: (req, res) => {
        todoModel.find()
            .then(todo => {
                res.send(todo);
            }).catch(err => {
                res.state(500).send({
                    message: err.message || "an error occured while retrieving all todo items"
                });
            });
    },

    // retrieve single todo item with specific todoId
    getById: (req, res) => {
        todoModel.findById(req.params.todoId)
            .then(todo => {
                if (!todo) {
                    return res.status(404).send({
                        message: "todo item not found with id " + req.params.todoId
                    });
                }
                res.send(todo);
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "todo item not found with id " + req.params.todoId
                    });
                }
                return res.status(500).send({
                    message: "an error occured while retrieving todo item with id " + req.params.todoId
                });
            });
    },

    // update a todo item with specific todoId
    update: (req, res) => {
        todoModel.findByIdAndUpdate(req.params.todoId, req.body, { new: true })
            .then(todo => {
                if (!todo) {
                    return res.status(404).send({
                        message: "todo item not found with id " + req.params.todoId
                    });
                }
                res.send(todo);
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "todo item not found with id " + req.params.todoId
                    });
                }
                return res.status(500).send({
                    message: "an error occured while retrieving todo item with id " + req.params.todoId
                });
            });
    },

    // delete a todo item with specific todoId
    delete: (req, res) => {
        todoModel.findByIdAndRemove(req.params.todoId)
            .then(todo => {
                if (!todo) {
                    return res.status(404).send({
                        message: "todo item not found with id " + req.params.todoId
                    });
                }
                res.send({ message: "todo item deleted successfully" });
            }).catch(err => {
                if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                    return res.status(404).send({
                        message: "todo item not found with id " + req.params.todoId
                    });
                }
                return res.status(500).send({
                    message: "an error occured while deleting todo item with id " + req.params.todoId
                });
            });
    }
}