const path = require('path')
const fs = require('fs').promises
const { Op } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const { Storage } = require('@google-cloud/storage')
const User = require('../user/user-model.js')
const Resto = require('../restoran/resto-model.js')
const Product = require('./product-model.js')
const Favorite = require('../favorite/favorite-model.js')
const ResponseError = require('../middleware/response-error.js')
const NotificationService = require('../notification/notification-service.js');
const Transaction = require('../transaction/transaction-model.js');


const keyFilename = path.join(__dirname, '../../credentials/storage-admin-key.json')
const GCS = new Storage({ keyFilename })
const bucketName = process.env.BUCKET_NAME || 'BUCKET_NAME'

class ProductService {
    static getProducts = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchProducts = await Product.findAll({
            where: { active: true },
            include: [{
                model: Favorite,
                required: false
            }, {
                model: Resto,
                required: false
            }, {
                model: Transaction,
                required: false
            }]
        })
        if (searchProducts.length === 0) return 404
        const productsAfterUpdateKategori = searchProducts.map(product => {
            const lokasiRestoran = product.dataValues.restoran.dataValues.kecamatan && product.dataValues.restoran.dataValues.kota_kab ?
                `${product.dataValues.restoran.dataValues.kecamatan}, ${product.dataValues.restoran.dataValues.kota_kab}` :
                'Kota Tidak Ada'
            const kagetoriProduct = product.dataValues.kategori
            const resultKategori = kagetoriProduct.replace(/,\s+/g, ',');
            const listKategori = resultKategori.split(',')
            const transactions = product.dataValues.transactions
            let rating = '0'
            if (transactions.length > 0) {
                const restoRating = searchTransaction.map(transaction => transaction.dataValues.rating)
                const newRating = (restoRating.reduce((a, b) => a + b, 0) / restoRating.length)
                rating = parseFloat(newRating).toFixed(2)
            }
            return {
                product_id: product.dataValues.product_id,
                image: product.dataValues.image,
                active: product.dataValues.active,
                status: product.dataValues.status,
                type: product.dataValues.type,
                porsi: product.dataValues.porsi,
                harga: product.dataValues.type ? 10000 : 0,
                kategori: listKategori,
                resto_id: product.dataValues.resto_id,
                nama_resto: product.dataValues.restoran.dataValues.nama,
                lokasi: lokasiRestoran,
                favorites: product.dataValues.favorites,
                rating: rating.toString()
            }
        })
        const productsAfterFavorite = productsAfterUpdateKategori.map(product => {
            return {
                ...product,
                isFavorite: product.favorites.some(fav => {
                    return fav.dataValues.product_id === product.product_id &&
                        fav.dataValues.user_id === searchUser.dataValues.user_id
                })
            }
        })
        return productsAfterFavorite.map(product => {
            return {
                productID: product.product_id,
                image: product.image,
                active: product.active,
                status: product.status,
                type: product.type,
                porsi: product.porsi,
                harga: product.harga,
                kategori: product.kategori,
                restoID: product.resto_id,
                namaRestoran: product.nama_resto,
                lokasi: product.lokasi,
                isFavorite: product.isFavorite,
                rating: product.rating
            }
        })
    }

    static getProductsByResto = async(userID, namaResto) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchProducts = await Product.findAll({
            where: { active: true },
            include: [{
                model: Resto,
                required: false,
                where: {
                    nama: {
                        [Op.like]: `%${namaResto}%`
                    }
                }
            }, {
                model: Favorite,
                required: false
            }, {
                model: Transaction,
                required: false
            }]
        })
        if (searchProducts.length === 0) return 404
        const productsAfterUpdateKategori = searchProducts.map(product => {
            const lokasiRestoran = product.dataValues.restoran.dataValues.kecamatan && product.dataValues.restoran.dataValues.kota_kab ?
                `${product.dataValues.restoran.dataValues.kecamatan}, ${product.dataValues.restoran.dataValues.kota_kab}` :
                'Kota Tidak Ada'
            const kagetoriProduct = product.dataValues.kategori
            const resultKategori = kagetoriProduct.replace(/,\s+/g, ',');
            const listKategori = resultKategori.split(',')
            const transactions = product.dataValues.transactions
            let rating = 0
            transactions.forEach(transaction => rating += transaction.dataValues.rating)
            if (rating > 0) rating = rating / parseInt(transactions.length)
            return {
                product_id: product.dataValues.product_id,
                image: product.dataValues.image,
                active: product.dataValues.active,
                status: product.dataValues.status,
                type: product.dataValues.type,
                porsi: product.dataValues.porsi,
                harga: product.dataValues.type ? 10000 : 0,
                kategori: listKategori,
                resto_id: product.dataValues.resto_id,
                nama_resto: product.dataValues.restoran.dataValues.nama,
                lokasi: lokasiRestoran,
                favorites: product.dataValues.favorites,
                rating: rating.toString(),
            }
        })
        const productsAfterFavorite = productsAfterUpdateKategori.map(product => {
            return {
                ...product,
                isFavorite: product.favorites.some(fav => {
                    return fav.dataValues.product_id === product.product_id &&
                        fav.dataValues.user_id === searchUser.dataValues.user_id
                })
            }
        })
        return productsAfterFavorite.map(product => {
            return {
                productID: product.product_id,
                image: product.productID,
                active: product.active,
                status: product.status,
                type: product.type,
                porsi: product.porsi,
                harga: product.harga,
                kategori: product.kategori,
                restoID: product.resto_id,
                namaRestoran: product.nama_resto,
                lokasi: product.lokasi,
                isFavorite: product.isFavorite,
                rating: product.rating
            }
        })
    }

    static getProductsByKota = async(userID, lokasi) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchResto = await Resto.findAll({
            where: {
                [Op.or]: [{
                    kota_kab: {
                        [Op.like]: `%${lokasi}%`
                    }
                }, {
                    kecamatan: {
                        [Op.like]: `%${lokasi}%`
                    }
                }]
            },
            include: {
                model: Product,
                required: false,
                where: { active: true },
                include: [{
                        model: Favorite,
                        required: false
                    },
                    {
                        model: Transaction,
                        required: false
                    }
                ]
            }
        })
        if (searchResto.length === 0) return 404
        const restoProducts = searchResto.map(resto => {
            const products = resto.products.map(product => {
                const transactions = product.dataValues.transactions
                let rating = 0
                transactions.forEach(transaction => rating += transaction.dataValues.rating)
                if (rating > 0) rating = rating / parseInt(transactions.length)
                return {
                    product_id: product.dataValues.product_id,
                    active: product.dataValues.active,
                    image: product.dataValues.image,
                    status: product.dataValues.status,
                    type: product.dataValues.type,
                    porsi: product.dataValues.porsi,
                    harga: product.dataValues.type ? 10000 : 0,
                    kategori: product.dataValues.kategori,
                    resto_id: resto.dataValues.resto_id,
                    nama_resto: resto.dataValues.nama,
                    lokasi: resto.dataValues.kota_kab,
                    favorites: product.dataValues.favorites,
                    rating: rating.toString()
                }
            })
            return products
        })

        const products = restoProducts.flat()
        const productsAfterFavorite = products.map(product => {
            return {
                ...product,
                isFavorite: product.favorites.some(fav => {
                    return fav.dataValues.product_id === product.product_id &&
                        fav.dataValues.user_id === searchUser.dataValues.user_id
                })
            }
        })
        return productsAfterFavorite.map(product => {
            return {
                productID: product.product_id,
                image: product.productID,
                active: product.active,
                status: product.status,
                type: product.type,
                porsi: product.porsi,
                harga: product.harga,
                kategori: product.kategori,
                restoID: product.resto_id,
                namaRestoran: product.nama_resto,
                lokasi: product.lokasi,
                isFavorite: product.isFavorite,
                rating: product.rating
            }
        })
    }

    static getMyProducts = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: userID } })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        const searchProducts = await Product.findAll({
            where: { active: true },
            include: [{
                model: Resto,
                required: true,
                where: { user_id: userID }
            }, {
                model: Transaction,
                required: true
            }]
        })
        if (searchProducts.length === 0) return 404
        const productsAfterUpdateKategori = searchProducts.map(product => {
            const lokasiRestoran = product.dataValues.restoran.dataValues.kecamatan && product.dataValues.restoran.dataValues.kota_kab ?
                `${product.dataValues.restoran.dataValues.kecamatan}, ${product.dataValues.restoran.dataValues.kota_kab}` :
                'Kota Tidak Ada'
            const kagetoriProduct = product.dataValues.kategori
            const resultKategori = kagetoriProduct.replace(/,\s+/g, ',');
            const listKategori = resultKategori.split(',')
            const transactions = product.dataValues.transactions
            let rating = '0'
            if (transactions.length > 0) {
                const restoRating = transactions.map(transaction => transaction.dataValues.rating)
                const newRating = (restoRating.reduce((a, b) => a + b, 0) / restoRating.length)
                rating = parseFloat(newRating).toFixed(2)
            }
            return {
                productID: product.dataValues.product_id ? product.dataValues.product_id : null,
                image: product.dataValues.image ? product.dataValues.image : null,
                active: product.dataValues.active ? product.dataValues.active : null,
                status: product.dataValues.status ? product.dataValues.status : null,
                type: product.dataValues.type ? product.dataValues.type : null,
                porsi: product.dataValues.porsi ? product.dataValues.porsi : null,
                harga: product.dataValues.type ? 10000 : 0,
                kategori: listKategori ? listKategori : null,
                restoID: product.dataValues.resto_id ? product.dataValues.resto_id : null,
                namaRestoran: product.dataValues.restoran.dataValues.nama ? product.dataValues.restoran.dataValues.nama : null,
                lokasi: lokasiRestoran ? lokasiRestoran : null,
                rating: rating ? rating.toString() : null
            }
        })
        return productsAfterUpdateKategori
    }

    static getProduct = async(userID, productID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchProduct = await Product.findOne({
            where: { product_id: productID, active: true },
            include: [{ model: Resto, required: false }, { model: Favorite, required: false }]
        })
        if (!searchProduct) throw new ResponseError(404, 'Product Tidak Ada')
        const productActive = searchProduct.dataValues.active
        if (!productActive) throw new ResponseError(400, 'Product Tidak Aktif')
        const lokasiRestoran = searchProduct.dataValues.restoran.dataValues.kecamatan && searchProduct.dataValues.restoran.dataValues.kota_kab ?
            `${searchProduct.dataValues.restoran.dataValues.kecamatan}, ${searchProduct.dataValues.restoran.dataValues.kota_kab}` :
            'Kota Tidak Ada'
        const kagetoriProduct = searchProduct.dataValues.kategori
        const resultKategori = kagetoriProduct.replace(/,\s+/g, ',');
        const listKategori = resultKategori.split(',')
        const products = {
            product_id: searchProduct.dataValues.product_id,
            image: searchProduct.dataValues.image,
            active: searchProduct.dataValues.active,
            status: searchProduct.dataValues.status,
            type: searchProduct.dataValues.type,
            porsi: searchProduct.dataValues.porsi,
            harga: searchProduct.dataValues.type ? 10000 : 0,
            kategori: listKategori,
            resto_id: searchProduct.dataValues.resto_id,
            nama_resto: searchProduct.dataValues.restoran.dataValues.nama,
            lokasi: lokasiRestoran,
            favorites: searchProduct.dataValues.favorites,
            isFavorite: null
        }
        products['isFavorite'] = products.favorites.some(fav => {
            return fav.dataValues.product_id === searchProduct.dataValues.product_id &&
                fav.dataValues.user_id === searchUser.dataValues.user_id
        })
        return {
            productID: products.product_id,
            image: products.image,
            active: products.active,
            status: products.status,
            type: products.type,
            porsi: products.porsi,
            harga: products.harga,
            kategori: products.kategori,
            resto_id: products.resto_id,
            nama_resto: products.nama_resto,
            lokasi: products.lokasi,
            isFavorite: products.isFavorite,
        }
    }

    static postProduct = async(userID, filePath, request) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: userID } })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        const {
            resto_id: restoID,
            slogan,
            deskripsi,
            provinsi,
            kota_kab: kotaKab,
            kecamatan,
            kelurahan,
            alamat_lengkap: alamatLengkap
        } = searchResto.dataValues
        const missingVariables = [!userID && 'userID', !slogan && 'slogan', !deskripsi && 'deskripsi', !provinsi && 'provinsi', !kotaKab && 'kotaKab', !kecamatan && 'kecamatan', !kelurahan && 'kelurahan', !alamatLengkap && 'alamatLengkap', ].filter(Boolean);
        if (missingVariables.length > 0) {
            const missingVariablesList = missingVariables.join(', ');
            throw new ResponseError(400, `Data Restoran Tidak Lengkap. Variabel yang tidak ada: ${missingVariablesList}`);
        }
        const { type, status: makananLayak } = request
        const searchProductBerbayar = await Product.count({ where: { resto_id: restoID, active: true, type: true } })
        const searchProductGratis = await Product.count({ where: { resto_id: restoID, active: true, type: false } })
        if (searchProductBerbayar > 0 && searchProductGratis > 0) throw new ResponseError(400, 'Anda Sudah Terlalu Banyak Menambahkan Makanan Hari Ini')
        if (type && searchProductBerbayar > 0) throw new ResponseError(400, 'Anda Sudah Menambahkan Makanan Hari Ini, Setiap Hari Hanya Boleh Menambahkan 1 Makanan Berbayar')
        if (!type && searchProductGratis > 0) throw new ResponseError(400, 'Anda Sudah Menambahkan Makanan Hari Ini, Setiap Hari Hanya Boleh Menambahkan 1 Makanan Gratis')
        if (!makananLayak) throw new ResponseError(400, 'Makanan Sudah Kadaluarsa')
        const productID = uuidv4().toString()
        const fileName = path.basename(filePath)
        const destFileName = `api-service/product/${fileName}`
        await GCS.bucket(bucketName).upload(filePath, { destination: destFileName, })
        const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`
        const newProduct = {
            product_id: productID,
            resto_id: restoID,
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
        const pushNotification = await NotificationService.postNotificationResto(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return true
    }
}

module.exports = ProductService