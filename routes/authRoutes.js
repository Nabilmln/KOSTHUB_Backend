const express = require('express');

const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.put('/change-password', authController.changePassword);

module.exports = authRouter;