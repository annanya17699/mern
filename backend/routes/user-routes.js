const express = require("express");
const validator = require('express-validator')

const userController = require('../controller/user-controller')

const router = express.Router();

router.get('/', userController.getAllUsers);

router.post('/signup',[
 validator.check('name')
 .not()
 .isEmpty(),
 validator.check('email')
 .normalizeEmail()
 .isEmail(),
 validator.check('password')
 .isLength({min: 8})
], userController.signup);

router.post('/login', userController.login);

module.exports = router;