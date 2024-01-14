const Joi = require('joi')

const usernameCantUse = [
    'admin',
    'Admin',
    'administrator',
    'Administrator',
    'superadmin',
    'SuperAdmin',
    'superadministrator',
    'SuperAdministrator'
]

const RegisterValidation = Joi.object({
    nama: Joi.string().min(4).max(255).required(),
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
    confirmPassword: Joi.string().min(8).max(255).required(),
})

const LoginValidation = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
})

const VerifyValidation = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    otp: Joi.string().min(6).max(6).required(),
})

const EmailValidation = Joi.string().min(5).max(255).required()

const ForgotPasswordValidation = Joi.object({
    email: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(8).max(255).required(),
    confirmPassword: Joi.string().min(8).max(255).required(),
})

module.exports = {
    usernameCantUse,
    RegisterValidation,
    LoginValidation,
    VerifyValidation,
    EmailValidation,
    ForgotPasswordValidation
}