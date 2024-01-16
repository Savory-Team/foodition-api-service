const { v4: uuidv4 } = require('uuid')
const validate = require('../middleware/validation.js')
const User = require('../user/user-model.js')
const Resto = require('../restoran/resto-model.js')
const NotificationUser = require('./notification-model-user.js')
const NotificationResto = require('./notification-model-resto.js')
const NotificationValidation = require('./notification-validation.js')
const ResponseError = require('../middleware/response-error.js')

class NotificationService {
    static getNotificationsUser = async(userID) => {
        const validUserID = validate(NotificationValidation.UserIDValidation, userID)
        const searchUser = await User.findOne({ where: { user_id: validUserID } })
        if (!searchUser) throw new ResponseError(404, 'User Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'User Belum Aktif')
        const getNotificationUserUsingUserID = await NotificationUser.findAll({ where: { user_id: searchUser.dataValues.user_id } })
        if (getNotificationUserUsingUserID.length === 0) return 404
        return getNotificationUserUsingUserID
    }

    static getNotificationsResto = async(userID) => {
        const validUserID = validate(NotificationValidation.UserIDValidation, userID)
        const searchUser = await User.findOne({ where: { user_id: validUserID } })
        if (!searchUser) throw new ResponseError(404, 'User Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'User Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: searchUser.dataValues.user_id } })
        if (!searchResto) throw new ResponseError(404, 'Restoran Tidak Ada')
        const getNotificationRestoUsingRestoID = await NotificationResto.findAll({ where: { resto_id: searchResto.dataValues.resto_id } })
        if (getNotificationRestoUsingRestoID.length === 0) return 404
        return getNotificationRestoUsingRestoID
    }

    static postNotificationUser = async(request) => {
        const validRequest = validate(NotificationValidation.PostNotificationValidation, request)
        const { user_id, type, title, message } = validRequest
        const searchUser = await User.findOne({ where: { user_id } })
        if (!searchUser) throw new ResponseError(404, 'User Tidak Ada')
        const isRegister = request.title === 'Yeayy! Selamat akun anda berhasil dibuat.'
        if (!isRegister) {
            const isActive = searchUser.dataValues.active
            if (!isActive) throw new ResponseError(400, 'User Belum Aktif')
        }
        const notification_id = uuidv4().toString()
        const userID = searchUser.dataValues.user_id
        const createNotification = await NotificationUser.create({ notification_id, user_id: userID, type, title, message })
        if (!createNotification) return false
        return true
    }

    static postNotificationResto = async(request) => {
        const validRequest = validate(NotificationValidation.PostNotificationValidation, request)
        const { user_id, type, title, message } = validRequest
        const searchUser = await User.findOne({ where: { user_id } })
        if (!searchUser) throw new ResponseError(404, 'User Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'User Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: searchUser.dataValues.user_id } })
        if (!searchResto) throw new ResponseError(404, 'Restoran Tidak Ada')
        const restoID = searchResto.dataValues.resto_id
        const notification_id = uuidv4().toString()
        const createNotification = await NotificationResto.create({ notification_id, resto_id: restoID, type, title, message })
        if (!createNotification) return false
        return true
    }
}

module.exports = NotificationService