const express = require('express')
const UserController = require('./user-controller.js')
const errorMiddleware = require('../middleware/error-middleware.js')
const Authentication = require('../middleware/authentication.js')
const UserRouting = express.Router()

UserRouting.get('/user/me', Authentication, UserController.getMyProfile, errorMiddleware)
UserRouting.get('/user/me/detail', Authentication, UserController.getMyDetailProfile, errorMiddleware)

UserRouting.get('/user/me/alamat', Authentication, UserController.getMyAlamat, errorMiddleware)
UserRouting.get('/user/me/nama', Authentication, UserController.getMyNama, errorMiddleware)
UserRouting.get('/user/me/username', Authentication, UserController.getMyUsername, errorMiddleware)
UserRouting.get('/user/me/bio', Authentication, UserController.getMyBio, errorMiddleware)
UserRouting.get('/user/me/nohp', Authentication, UserController.getMyNohp, errorMiddleware)
UserRouting.get('/user/me/jenisKelamin', Authentication, UserController.getMyJenisKelamin, errorMiddleware)
UserRouting.get('/user/me/tanggalLahir', Authentication, UserController.getMyTanggalLahir, errorMiddleware)

UserRouting.post('/user/me/alamat', Authentication, UserController.postAlamat, errorMiddleware)

UserRouting.put('/user/me/forgot/password', Authentication, UserController.forgotPassword, errorMiddleware)
UserRouting.put('/user/me/alamat', Authentication, UserController.putMyAlamat, errorMiddleware)
UserRouting.put('/user/me/nama', Authentication, UserController.putMyNama, errorMiddleware)
UserRouting.put('/user/me/username', Authentication, UserController.putMyUsername, errorMiddleware)
UserRouting.put('/user/me/bio', Authentication, UserController.putMyBio, errorMiddleware)
UserRouting.put('/user/me/nohp', Authentication, UserController.putMyNohp, errorMiddleware)
UserRouting.put('/user/me/jenisKelamin', Authentication, UserController.putMyJenisKelamin, errorMiddleware)
UserRouting.put('/user/me/tanggalLahir', Authentication, UserController.putMyTanggalLahir, errorMiddleware)

module.exports = UserRouting