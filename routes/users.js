const express = require('express');
const router = express.Router();
const userController = require('../app/api/controllers/users.js');

router.post('/reg', userController.create);
router.post('/auth', userController.authenticate);

module.exports = router;