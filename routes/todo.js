const express = require('express');
const router = express.Router();
const todoController = require('../app/api/controllers/todo.js');

router.post('/', todoController.create);
router.get('/', todoController.getAll);
router.get('/:todoId', todoController.getById);
router.put('/:todoId', todoController.update);
router.delete('/:todoId', todoController.delete);

module.exports = router;
