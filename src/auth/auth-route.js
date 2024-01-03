const express = require('express')
const AuthController = require('./auth-controller.js')
const errorMiddleware = require('../middleware/error-middleware.js')
const AuthRouting = express.Router()

AuthRouting.post('/register', AuthController.register, errorMiddleware)
AuthRouting.post('/login', AuthController.login, errorMiddleware)
AuthRouting.post('/otp/verify', AuthController.verifyOTP, errorMiddleware)
AuthRouting.get('/otp', AuthController.getOTP, errorMiddleware)
AuthRouting.post('/forgot/password', AuthController.forgotPassword, errorMiddleware)

module.exports = AuthRouting