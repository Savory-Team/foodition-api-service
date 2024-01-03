const express = require('express')
const LocationController = require('./location-controller.js')
const Authentication = require('../middleware/authentication.js')
const errorMiddleware = require('../middleware/error-middleware.js')

const LocationRouting = express.Router()

LocationRouting.get('/provinsi', Authentication, LocationController.getProvinsi, errorMiddleware)
LocationRouting.get('/provinsi/:id/kota', Authentication, LocationController.getKota, errorMiddleware)

module.exports = LocationRouting