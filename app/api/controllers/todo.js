const todoModel = require('../models/todo.js');

// helper for filter
const filter = (degreeValue, filterValue) => {
    return (!filterValue || filterValue == degreeValue);
};

// helper for checking owner of item
const checkOwner = (todoId, userId, next) => {
    return new Promise(resolve => {
        todoModel.findById(todoId, async (err, todo) => {
            if (err) {
                next(err);
            } else if (!todo) {
                err = new Error("not found");
                err.status = 404;
                next(err);
            }
            else if (todo.ownerId != userId) {
                err = new Error("you are not the owner of this item");
                err.status = 400;
                next(err);
            } else {
                resolve();
            }
        });
    });
};

module.exports = {
    create: (req, res, next) => {
        // validation (task and category must be filled) 
        if (!req.body.task || !req.body.category) {
            return res.status(400).send({ message: "task and category must not be empty" });
        }

        // create todo item (default value of completed is false)
        todoModel.create({
            ownerId: req.body.userId,
            task: req.body.task,
            category: req.body.category,
            description: req.body.description || "n/a",
            completed: false
        }, (err, todo) => {
            if (err) {
                next(err);
            } else {
                res.json({ 
                    message: "todo item added successfully", 
                    data: todo 
                });
            }
        })
    },

    // retrieve all todo items and filter by user-requested fields
    getAll: (req, res, next) => {
        const category = req.query.category;
        const completed = req.query.completed;

        let results = [];
        todoModel.find({}, (err, todos) => {
            if (err) {
                next(err);
            } else {
                for (let todo of todos) {
                    // check filters category and completed
                    if (filter(todo.category, category) && filter(todo.completed.toString(), completed)) {
                        results.push(todo);
                    }
                }
                if (results.length === 0) {
                    res.json({ message: "no results found after filtering" });
                    return;
                }
                res.send(results);
            }
        });
    },

    // retrieve single todo item with specific todoId
    getById: (req, res, next) => {
        todoModel.findById(req.params.todoId, (err, todo) => {
            if (err) {
                next(err);
            } else if (!todo) {
                err = new Error("not found");
                err.status = 404;
                next(err);
            } else {
                res.send(todo);
            }
        });
    },

    // update a todo item with specific todoId
    update: async (req, res, next) => {
        await checkOwner(req.params.todoId, req.body.userId, next);

        todoModel.findByIdAndUpdate(req.params.todoId, req.body, { new: true }, (err, todo) => {
            if (err) {
                next(err);
            } else {
                res.json({ 
                    message: "todo item updated successfully", 
                    data: todo 
                });
            }
        });
    },

    // delete a todo item with specific todoId
    delete: async (req, res, next) => {
        await checkOwner(req.params.todoId, req.body.userId, next);

        todoModel.findByIdAndDelete(req.params.todoId, (err) => {
            if (err) {
                next(err);
            } else {
                res.json({ message: "todo item deleted successfully" });
            }
        });
    }
}