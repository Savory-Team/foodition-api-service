const express = require('express')
const NotificationController = require('./notification-controller.js')
const errorMiddleware = require('../middleware/error-middleware.js')
const Authentication = require('../middleware/authentication.js')
const NotificationRouting = express.Router()

NotificationRouting.get('/notifications/user/me', Authentication, NotificationController.getNotificationsUser, errorMiddleware)
NotificationRouting.get('/notifications/resto/me', Authentication, NotificationController.getNotificationsResto, errorMiddleware)

module.exports = NotificationRouting