const path = require('path')
const fs = require('fs').promises
const { v4: uuidv4 } = require('uuid')
const { Storage } = require('@google-cloud/storage')
const User = require('../user/user-model.js')
const Resto = require('../restoran/resto-model.js')
const Product = require('./product-model.js')
const ResponseError = require('../middleware/response-error.js')
const NotificationService = require('../notification/notification-service.js')


const keyFilename = path.join(__dirname, '../../credentials/storage-admin-key.json')
const GCS = new Storage({ keyFilename })
const bucketName = process.env.BUCKET_NAME || 'BUCKET_NAME'

class ProductService {
    static getProducts = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchProducts = await Product.findAll({ where: { active: true }, include: Resto })
        if (searchProducts.length === 0) throw new ResponseError(404, 'Products Tidak Ada')
        const newProducts = searchProducts.map(product => {
            const lokasiRestoran = product.dataValues.restoran.dataValues.kecamatan && product.dataValues.restoran.dataValues.kota_kab ?
                `${product.dataValues.restoran.dataValues.kecamatan}, ${product.dataValues.restoran.dataValues.kota_kab}` :
                'Kota Tidak Ada'
            const kagetoriProduct = product.dataValues.kategori
            const resultKategori = kagetoriProduct.replace(/,\s+/g, ',');
            const listKategori = resultKategori.split(',')
            return {
                productID: product.dataValues.product_id,
                image: product.dataValues.image,
                active: product.dataValues.active,
                status: product.dataValues.status,
                type: product.dataValues.type,
                porsi: product.dataValues.porsi,
                harga: product.dataValues.type ? 10000 : 0,
                kategori: listKategori,
                namaRestoran: product.dataValues.restoran.dataValues.nama,
                lokasi: lokasiRestoran
            }
        })
        return newProducts
    }

    static getMyProducts = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: userID } })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        const restoranID = searchResto.dataValues.resto_id
        const searchProducts = await Product.findAll({ where: { resto_id: restoranID } })
        if (searchProducts.length === 0) throw new ResponseError(404, 'Produk Tidak Ada')
        const myProducts = searchProducts.map(product => {
            const kagetoriProduct = product.dataValues.kategori
            const resultKategori = kagetoriProduct.replace(/,\s+/g, ',');
            const listKategori = resultKategori.split(',')
            return {
                productID: product.dataValues.product_id,
                image: product.dataValues.image,
                active: product.dataValues.active,
                status: product.dataValues.status,
                type: product.dataValues.type,
                porsi: product.dataValues.porsi,
                kagetori: listKategori,
                harga: product.dataValues.type ? 10000 : 0
            }
        })
        return myProducts
    }

    static postProduct = async(userID, filePath, request) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: userID } })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        const restoID = searchResto.dataValues.resto_id
        const searchProduct = await Product.count({ where: { resto_id: restoID, active: true } })
        if (searchProduct > 0) throw new ResponseError(400, 'Anda Sudah Menambahkan Makanan Hari Ini, Setiap Hari Hanya Boleh Menambahkan 1 Makanan')
        const makananLayak = request.status
        if (!makananLayak) throw new ResponseError(400, 'Makanan Sudah Kadaluarsa')
        const restoranID = searchResto.dataValues.resto_id
        const productID = uuidv4().toString()
        const fileName = path.basename(filePath)
        const destFileName = `api-service/product/${fileName}`
        await GCS.bucket(bucketName).upload(filePath, { destination: destFileName, })
        const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`
        const newProduct = {
            product_id: productID,
            resto_id: restoranID,
            image: url,
            active: true,
            status: request.status,
            type: request.type,
            porsi: request.porsi,
            kategori: request.kategori,
        }
        const createProduct = await Product.create(newProduct)
        if (!createProduct) throw new ResponseError(400, 'Tambah Product Gagal')
        fs.unlink(filePath)
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Menambahkan Product',
            message: 'Yeay! Selamat anda berhasil menambahkan product, semoga product anda bermanfaat untuk masyarakat',
        }
        const pushNotification = await NotificationService.postNotification(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return true
    }
}

module.exports = ProductService