const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    task: String,
    category: String,
    description: String,
    completion: Boolean // not filled by the user, default value false when item is created
}, {
    timestamps: true
});

module.exports = mongoose.model('todo', todoSchema);