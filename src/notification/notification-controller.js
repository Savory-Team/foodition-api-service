const NotificationService = require('./notification-service.js')

class NotificationController {
    static getNotifications = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await NotificationService(userID)
            return res.status(200).json({ error: false, message: 'GET Notifications Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = NotificationController