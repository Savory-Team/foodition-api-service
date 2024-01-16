const FavoriteService = require('./favorite-service.js')
const FavoriteValidation = require('./favorite-validation.js')
const validate = require('../middleware/validation.js')

class FavoriteController {
    static getMyFavorites = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await FavoriteService.getMyFavorites(userID)
            if (result === 404) return res.status(404).json({ error: true, message: 'Favorite Tidak Ada', data: [] })
            res.status(200).json({ error: false, message: 'GET Favorite Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static postFavorite = async(req, res, next) => {
        try {
            const userID = req.userID
            const productID = req.params.id
            const validUserID = validate(FavoriteValidation.userID, userID)
            const validProductID = validate(FavoriteValidation.productID, productID)
            const result = await FavoriteService.postFavorite(validUserID, validProductID)
            res.status(200).json({ error: false, message: 'Menambahkan Product Ke Favorite Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static deleteFavorite = async(req, res, next) => {
        try {
            const userID = req.userID
            const productID = req.params.id
            const result = await FavoriteService.deleteFavorite(userID, productID)
            res.status(200).json({ error: false, message: 'Menghapus Product Dari Favorite Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = FavoriteController