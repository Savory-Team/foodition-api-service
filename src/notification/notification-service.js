const { v4: uuidv4 } = require('uuid')
const validate = require('../middleware/validation.js')
const Notification = require('./notification-model')
const NotificationValidation = require('./notification-validation.js')
const ResponseError = require('../middleware/response-error.js')

class NotificationService {
    static getNotifications = async(userID) => {
        const validUserID = validate(NotificationValidation.UserIDValidation, userID)
        const getNotificationUserUsingUserID = await Notification.findAll({ where: { user_id: validUserID } })
        if (getNotificationUserUsingUserID.length === 0) throw new ResponseError(404, 'Notifikasi Tidak Ada')
        return getNotificationUserUsingUserID
    }

    static postNotification = async(request) => {
        const validRequest = validate(NotificationValidation.PostNotificationValidation, request)
        const { user_id, type, title, message } = validRequest
        const notification_id = uuidv4().toString()
        const createNotification = await Notification.create({ notification_id, user_id, type, title, message })
        if (!createNotification) return false
        return true
    }
}

module.exports = NotificationService