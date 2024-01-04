const path = require('path')
const ResponseError = require('../middleware/response-error.js')
const validate = require('../middleware/validation.js')
const User = require('../user/user-model.js')
const Product = require('./product-model.js')
const ProductService = require('./product-service.js')
const ProductValidation = require('./product-validation.js')
const NotificationService = require('../notification/notification-service.js')

class ProductController {
    static getMyProducts = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await ProductService.getMyProducts(userID)
            res.status(200).json({ error: false, message: 'GET Products Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static postProduct = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body
            const file = req.file
            const validRequest = validate(ProductValidation.PostProductValidation, request)
            if (!file) throw new ResponseError(400, 'Tidak ada foto yang diunggah')
            const filename = file.filename
            const filePath = path.join(__dirname, '../../uploads', filename)
            const result = await ProductService.postProduct(userID, filePath, validRequest)
            res.status(200).json({ error: false, message: 'Tambah Product Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static resetProductsActive = async(req, res, next) => {
        try {
            const key = req.headers['key']
            if (!key) throw new ResponseError(400, 'Key Dibutuhkan')
            const RESET_KEY = process.env.RESET_KEY || 'ResetKey'
            const matchKey = key === RESET_KEY
            if (!matchKey) throw new ResponseError(400, 'Key Salah')
            const products = await Product.findAll()
            for (const product of products) {
                product.active = false
                const updateProduct = await product.save()
                if (!updateProduct) throw new ResponseError(400, 'Status Product Gagal Diubah')
            }
            const users = await User.findAll()
            for (const user of users) {
                const dataNotification = {
                    user_id: user.dataValues.user_id,
                    type: '0',
                    title: 'Update Status Product Anda',
                    message: 'Product anda sudah dinonaktifkan, silahkan buat product kembali',
                }
                const pushNotification = await NotificationService.postNotification(dataNotification)
                if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
            }
            res.status(200).json({ error: false, message: 'Ubah Semua Status Product Berhasil' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ProductController