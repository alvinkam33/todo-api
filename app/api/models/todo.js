const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    ownerId: String, // not filled by the user, userId of creator of todo item
    task: String,
    category: String,
    description: String,
    completed: Boolean // not filled by the user, default value false when item is created
}, {
    timestamps: true
});

module.exports = mongoose.model('todo', todoSchema);