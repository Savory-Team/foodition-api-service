const validate = require('../middleware/validation.js')
const validator = require('validator')
const AuthService = require('./auth-service.js')
const AuthValidation = require('./auth-validation.js')
const ResponseError = require('../middleware/response-error.js')

class AuthController {
    static register = async(req, res, next) => {
        try {
            const request = req.body
            const validRequest = validate(AuthValidation.RegisterValidation, request)
            const isEmail = validator.isEmail(validRequest.email)
            if (!isEmail) throw new ResponseError(400, 'Email Tidak Valid')
            const result = await AuthService.register(validRequest)
            res.status(200).json({ error: false, message: 'Register Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static login = async(req, res, next) => {
        try {
            const request = req.body
            const validRequest = validate(AuthValidation.LoginValidation, request)
            const isEmail = validator.isEmail(validRequest.email)
            if (!isEmail) throw new ResponseError(400, 'Email Tidak Valid')
            const result = await AuthService.login(validRequest)
            res.status(200).json({ error: false, message: 'Login Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static verifyOTP = async(req, res, next) => {
        try {
            const request = req.body
            const validRequest = validate(AuthValidation.VerifyValidation, request)
            const isEmail = validator.isEmail(validRequest.email)
            if (!isEmail) throw new ResponseError(400, 'Email Tidak Valid')
            const result = await AuthService.verifyOTP(validRequest)
            res.status(200).json({ error: false, message: 'Verifikasi Akun Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getOTP = async(req, res, next) => {
        try {
            const request = req.body
            const validRequest = validate(AuthValidation.EmailValidation, request)
            const isEmail = validator.isEmail(validRequest.email)
            if (!isEmail) throw new ResponseError(400, 'Email Tidak Valid')
            const result = await AuthService.getOTP(validRequest)
            res.status(200).json({ error: false, message: 'OTP Berhasil Dikirimkan', data: result })
        } catch (error) {
            next(error)
        }
    }

    static forgotPassword = async(req, res, next) => {
        try {
            const request = req.body
            const validRequest = validate(AuthValidation.ForgotPasswordValidation, request)
            const result = await AuthService.forgotPassword(validRequest)
            res.status(200).json({ error: false, message: 'Password Berhasil Diubah', data: result })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = AuthController