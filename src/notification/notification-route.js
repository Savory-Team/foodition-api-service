const express = require('express')
const NotificationController = require('./notification-controller.js')
const errorMiddleware = require('../middleware/error-middleware.js')
const Authentication = require('../middleware/authentication.js')
const NotificationRouting = express.Router()

NotificationRouting.get('/notifications/me', Authentication, NotificationController.getNotifications, errorMiddleware)

module.exports = NotificationRouting