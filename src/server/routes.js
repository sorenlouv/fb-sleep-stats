var express = require('express');
var router = express.Router();
var userController = require('./controllers/user');

router.get('/rest/users', userController.listUsers);
router.get('/rest/users/:userId', userController.viewUser);


module.exports = router;
