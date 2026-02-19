const express = require('express');
const { register, login } = require('../controllers/authController');

const authRouter = express.Router();

authRouter.post("/signup", register);
authRouter.post("/login", login)


module.exports = authRouter