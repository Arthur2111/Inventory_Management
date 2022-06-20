const express = require('express');
const router = express.Router();
const userController= require('../controllers/userController');
const session = require('express-session');
const mysql = require('mysql');

//render login page
// router.get('/login', userController.login);


// create, find, update, delete 
router.get('/', userController.view);
router.post('/', userController.search);
router.get('/add-user', userController.add);
router.post('/add-user', userController.create);
router.get('/edituser/:id', userController.edit); //whenever edit need to :id to in route
router.post('/edituser/:id', userController.update); //whenever edit need to :id to in route
router.get('/viewuser/:id', userController.viewall);
router.get('/:id', userController.delete); //whenever edit need to :id to in route

// allows to export modules from various METHODs above
module.exports = router;