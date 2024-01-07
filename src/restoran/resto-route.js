const express = require('express')
const RestoController = require('./resto-controller.js')
const errorMiddleware = require('../middleware/error-middleware.js')
const Authentication = require('../middleware/authentication.js')
const upload = require('../utils/multer.js')

const RestoRouting = express.Router()

RestoRouting.get('/resto/me', Authentication, RestoController.getResto, errorMiddleware)
RestoRouting.get('/resto/me/detail', Authentication, RestoController.getDetailResto, errorMiddleware)
RestoRouting.get('/resto/me/alamat', Authentication, RestoController.getAlamatResto, errorMiddleware)
RestoRouting.put('/resto/me/photo', Authentication, upload.single('image'), RestoController.updatePhoto, errorMiddleware)
RestoRouting.put('/resto/me', Authentication, RestoController.putResto, errorMiddleware)
RestoRouting.put('/resto/me/alamat', Authentication, RestoController.putAlamat, errorMiddleware)

module.exports = RestoRouting