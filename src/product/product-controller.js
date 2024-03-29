const path = require('path')
const ResponseError = require('../middleware/response-error.js')
const validate = require('../middleware/validation.js')
const User = require('../user/user-model.js')
const Product = require('./product-model.js')
const ProductService = require('./product-service.js')
const ProductValidation = require('./product-validation.js')
const NotificationService = require('../notification/notification-service.js')
const Restoran = require('../restoran/resto-model.js')

class ProductController {
    static getProducts = async(req, res, next) => {
        try {
            const userID = req.userID
            const { resto, lokasi } = req.query
            if (resto) {
                const result = await ProductService.getProductsByResto(userID, resto)
                if (result === 404) return res.status(200).json({ error: false, message: 'Products Tidak Ada', data: [] })
                res.status(200).json({ error: false, message: 'GET Products By Resto Berhasil', data: result })
            } else if (lokasi) {
                const result = await ProductService.getProductsByKota(userID, lokasi)
                if (result === 404) return res.status(200).json({ error: false, message: 'Products Tidak Ada', data: [] })
                res.status(200).json({ error: false, message: 'GET Products By Lokasi Berhasil', data: result })
            } else {
                const result = await ProductService.getProducts(userID)
                if (result === 404) return res.status(200).json({ error: false, message: 'Products Tidak Ada', data: [] })
                res.status(200).json({ error: false, message: 'GET Products Berhasil', data: result })
            }
        } catch (error) {
            next(error)
        }
    }

    static getProduct = async(req, res, next) => {
        try {
            const userID = req.userID
            const productID = req.params.id
            const result = await ProductService.getProduct(userID, productID)
            res.status(200).json({ error: false, message: 'GET Product Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getMyProducts = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await ProductService.getMyProducts(userID)
            if (result === 404) return res.status(200).json({ error: false, message: 'Products Tidak Ada', data: [] })
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
            const products = await Product.findAll({ where: { active: true } })
            if (products.length === 0) throw new ResponseError(404, 'Product Tidak Ada')
            for (const product of products) {
                product.active = false
                const updateProduct = await product.save()
                if (!updateProduct) throw new ResponseError(400, 'Status Product Gagal Diubah')
                const searchUser = await Restoran.findOne({
                    where: { resto_id: product.dataValues.resto_id },
                    include: {
                        model: User,
                        required: true
                    }
                })
                if (!searchUser) throw new ResponseError(400, 'User Tidak Ada')
                const dataNotification = {
                    user_id: searchUser.dataValues.user_id,
                    type: '0',
                    title: 'Berhasil mengubah Data Restoran anda!',
                    message: 'Mengubah data restoran anda berhasil. Silahkan cek data restoran anda.',
                }
                const pushNotification = await NotificationService.postNotificationResto(dataNotification)
                if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
            }
            res.status(200).json({ error: false, message: 'Ubah Semua Status Product Berhasil' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = ProductController