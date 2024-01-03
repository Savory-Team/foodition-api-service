const ResponseError = require('../middleware/response-error.js')
const uuidINT = require('uuid-int')
const randomNumber = require('random-number')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../user/user-model.js')
const AuthValidation = require('./auth-validation.js')
const sendEmail = require('../utils/email-service.js')
const HTMLTemplateEmail = require('../application/html.js')
const NotificationService = require('../notification/notification-service.js')


class AuthService {
    static register = async(request) => {
        const matchPassword = request.password === request.confirmPassword
        if (!matchPassword) throw new ResponseError(400, 'Password Dan Confirm Password Tidak Sesuai')
        const checkUser = await User.count({ where: { email: request.email } })
        if (checkUser > 0) throw new ResponseError(400, 'Email sudah digunakan')
        const usernameCantUse = AuthValidation.usernameCantUse
        const checkUserAvailable = usernameCantUse.filter(username => username === request.username)
        if (checkUserAvailable.length > 0) throw new ResponseError(400, 'Email Sudah Digunakan')
        let userID = (uuidINT(randomNumber({ min: 0, max: 511, integer: true })).uuid() / 10).toString().split('.').join('')
        userID = userID.length === 15 ? `${userID}0` : userID
        const SALT = process.env.SALT || 12
        const hashPassword = await bcrypt.hash(request.password, SALT)
        const OTP = randomNumber({ min: 100000, max: 999999, integer: true })
        const subject = 'OTP Verification'
        const text = `Kode verifikasi akun Foodition anda adalah:`
        const html = HTMLTemplateEmail.RegisterHTML(OTP)
        const sendEmailService = await sendEmail(request.email, subject, text, html)
        if (!sendEmailService) throw new ResponseError(400, 'OTP Gagal Dikirim')
        const defaultPhoto = 'https://storage.googleapis.com/savory/api-service/user/default-user-image.png'
        const userRegister = await User.create({
            user_id: userID,
            email: request.email,
            nama: request.nama,
            password: hashPassword,
            otp: OTP,
            image: defaultPhoto,
        })
        if (!userRegister) throw new ResponseError(400, 'Register Gagal')
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Yeayy! Selamat akun anda berhasil dibuat.',
            message: 'Selamat datang di Foodition, Aplikasi pembelian makanan! Gunakan aplikasi dengan bijak, Ayo dukung INDONESIA tanpa kelaparan.'
        }
        const pushNotification = await NotificationService.postNotification(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return {
            email: userRegister.email,
            verify: 'Check Email Untuk Verifikasi Akun Menggunakan OTP'
        }
    }

    static login = async(request) => {
        const checkUser = await User.findOne({ where: { email: request.email } })
        if (!checkUser) throw new ResponseError(400, 'Email Dan Password Salah')
        const matchPassword = await bcrypt.compare(request.password, checkUser.password)
        if (!matchPassword) throw new ResponseError(400, 'Email Dan Password Salah')
        if (!checkUser.active) throw new ResponseError(400, 'Akun Belum Aktif')
        const SECRET_KEY = process.env.SECRET_KEY || 'SecretKeyAuth'
        const USERID = checkUser.user_id
        const token = jwt.sign({ USERID }, SECRET_KEY, { expiresIn: '30d' })
        return { token }
    }

    static verifyOTP = async(request) => {
        const checkUser = await User.findOne({ where: { email: request.email } })
        if (!checkUser) throw new ResponseError(400, 'User Tidak Ada')
        const matchOTP = checkUser.otp === request.otp
        if (!matchOTP) throw new ResponseError(400, 'OTP Salah')
        checkUser.active = true
        checkUser.otp = null
        checkUser.updatedAt = new Date()
        const updatedUser = await checkUser.save()
        if (!updatedUser) throw new ResponseError(400, 'Verifikasi Akun Gagal')
        return { verify: true }
    }

    static getOTP = async(request) => {
        const checkUser = await User.findOne({ where: { email: request.email } })
        if (!checkUser) throw new ResponseError(400, 'User Tidak Ada')
        const OTP = randomNumber({ min: 100000, max: 999999, integer: true })
        const subject = 'OTP Verification'
        const text = `Kode verifikasi akun Foodition anda adalah:`
        const html = HTMLTemplateEmail.GetOTPTemplate(OTP)
        const sendEmailService = await sendEmail(request.email, subject, text, html)
        if (!sendEmailService) throw new ResponseError(400, 'OTP Gagal Dikirim')
        checkUser.otp = OTP
        const updatedUser = await checkUser.save()
        if (!updatedUser) throw new ResponseError(400, 'OTP Gagal Dikirim')
        return {
            email: updatedUser.email,
            verify: 'Check Email Untuk Melihat OTP'
        }
    }

    static forgotPassword = async(request) => {
        const checkUser = await User.findOne({ where: { email: request.email } })
        if (!checkUser) throw new ResponseError(400, 'User Tidak Ada')
        const isActive = checkUser.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const matchPassword = request.password === request.confirmPassword
        if (!matchPassword) throw new ResponseError(400, 'Password Dan Confirm Password Tidak Sesuai')
        const SALT = process.env.SALT || 10
        const hashPassword = await bcrypt.hash(request.password, SALT)
        checkUser.password = hashPassword
        checkUser.updatedAt = new Date()
        const updatedUser = await checkUser.save()
        if (!updatedUser) throw new ResponseError(400, 'Ubah Password Gagal')
        return { updatePassword: true }
    }
}

module.exports = AuthService