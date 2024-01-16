const NotificationService = require('./notification-service.js')

class NotificationController {
    static getNotificationsUser = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await NotificationService.getNotificationsUser(userID)
            if (result === 404) return res.status(200).json({ error: false, message: 'Notifications Tidak Ada', data: [] })
            return res.status(200).json({ error: false, message: 'GET Notifications User Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getNotificationsResto = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await NotificationService.getNotificationsResto(userID)
            if (result === 404) return res.status(200).json({ error: false, message: 'Notifications Tidak Ada', data: [] })
            return res.status(200).json({ error: false, message: 'GET Notifications User Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = NotificationController