const { v4: uuidv4 } = require('uuid')
const Favorite = require('./favorite-model.js')
const Product = require('../product/product-model.js')
const User = require('../user/user-model.js')
const Resto = require('../restoran/resto-model.js')
const ResponseError = require('../middleware/response-error')

class FavoriteService {
    static getMyFavorites = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchMyFavorites = await Favorite.findAll({
            where: { user_id: userID },
            include: { model: Product, required: false, where: { active: true }, include: Resto }
        })
        if (searchMyFavorites.length === 0) throw new ResponseError(400, 'Favorite Tidak Ada')
        const myFavorites = searchMyFavorites.map(favorite => {
            const { alamat_lengkap, kota_kab, provinsi } = favorite.dataValues.product.dataValues.restoran.dataValues
            return {
                favoriteID: favorite.dataValues.favorite_id,
                userID: favorite.dataValues.user_id,
                productID: favorite.dataValues.product_id,
                restoID: favorite.dataValues.product.dataValues.resto_id,
                image: favorite.dataValues.product.dataValues.image,
                nama: favorite.dataValues.product.dataValues.restoran.dataValues.nama,
                alamat: `${alamat_lengkap}, ${kota_kab}, ${provinsi}`,
                favorite: true
            }
        })
        return myFavorites
    }

    static postFavorite = async(userID, productID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchProduct = await Product.findOne({ where: { product_id: productID } })
        if (!searchProduct) throw new ResponseError(400, 'Product Tidak Ada')
        const isFavorite = await Favorite.findOne({ where: { user_id: userID, product_id: productID } })
        if (isFavorite) throw new ResponseError(400, 'Product Sudah Dalam Favorite')
        const newFavorite = {
            favorite_id: uuidv4().toString(),
            product_id: searchProduct.dataValues.product_id,
            user_id: searchUser.dataValues.user_id
        }
        const createFavorite = await Favorite.create(newFavorite)
        if (!createFavorite) throw new ResponseError(400, 'Tambah Favorite Gagal')
        return true
    }

    static deleteFavorite = async(userID, productID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchProduct = await Product.findOne({ where: { product_id: productID } })
        if (!searchProduct) throw new ResponseError(400, 'Product Tidak Ada')
        const searchFavorite = await Favorite.findOne({ where: { user_id: userID, product_id: productID } })
        if (!searchFavorite) throw new ResponseError(400, 'Product Tidak Dalam Favorite')
        const deleteFavorite = await Favorite.destroy({
            where: {
                product_id: searchFavorite.dataValues.product_id,
                user_id: searchFavorite.dataValues.user_id
            }
        })
        if (deleteFavorite.length === 0) throw new ResponseError(400, 'Hapus Favorite Gagal')
        return true
    }
}

module.exports = FavoriteService