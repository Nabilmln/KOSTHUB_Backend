const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.put('/change-password', authController.changePassword);
authRouter.put('/update-profile', verifyToken, upload.single("fotoProfil"), authController.updateProfile);

module.exports = authRouter;