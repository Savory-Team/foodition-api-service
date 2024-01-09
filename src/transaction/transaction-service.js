const moment = require('moment');
const { v4: uuidv4 } = require('uuid')
const User = require('../user/user-model.js')
const Product = require('../product/product-model.js')
const Resto = require('../restoran/resto-model.js')
const Transaction = require('../transaction/transaction-model.js')
const ResponseError = require('../middleware/response-error')
const NotificationService = require('../notification/notification-service')

class TransactionService {
    static getHistoryUser = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchTransaction = await Transaction.findAll({
            where: { user_id: searchUser.dataValues.user_id },
            include: { model: Product, required: true, include: { model: Resto, required: true } }
        })
        if (searchTransaction.length === 0) throw new ResponseError(404, 'History Pembelian Tidak Ada')
        const TransactionHistory = searchTransaction.map(transaction => {
            return {
                transactionID: transaction.dataValues.transaction_id,
                namaProduct: transaction.dataValues.product.dataValues.restoran.dataValues.nama,
                image: transaction.dataValues.product.dataValues.image,
                price: transaction.price,
                tanggal: moment(transaction.dataValues.createdAt).format("DD MMMM YYYY"),
                status: transaction.dataValues.status,
                ulas: transaction.dataValues.rating === 0 ? true : false
            }
        })
        return TransactionHistory
    }

    static getHistoryUserDetail = async(userID, transactionID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchTransaction = await Transaction.findOne({ where: { transaction_id: transactionID } })
        if (!searchTransaction) throw new ResponseError(404, 'Transaksi Tidak Ada')
        if (searchTransaction.dataValues.user_id !== userID) throw new ResponseError('Transaksi Tidak Ada')
        const searchResto = await Transaction.findOne({
            where: { transaction_id: transactionID },
            include: {
                model: Product,
                required: true,
                include: {
                    model: Resto,
                    required: true
                }
            }
        })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        const { nama: namaRestoran, kecamatan, kelurahan, alamat_lengkap: alamatLengkap } = searchResto.dataValues.product.dataValues.restoran.dataValues
        return {
            transactionID: searchTransaction.dataValues.transaction_id,
            price: searchTransaction.dataValues.price,
            namaRestoran: namaRestoran,
            alamatRestoran: `${alamatLengkap}, ${kelurahan}, ${kecamatan}`,
            status: searchTransaction.dataValues.status,
        }
    }

    static getHistoryResto = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: searchUser.dataValues.user_id } })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        const searchTransaction = await Transaction.findAll({
            include: {
                model: Product,
                required: true,
                include: {
                    model: Resto,
                    required: true,
                    where: { user_id: searchResto.dataValues.user_id }
                }
            }
        })
        if (searchTransaction.length === 0) throw new ResponseError(404, 'History Penjualan Tidak Ada')
        const TransactionHistory = searchTransaction.map(transaction => {
            return {
                transactionID: transaction.dataValues.transaction_id,
                namaProduct: transaction.dataValues.product.dataValues.restoran.dataValues.nama,
                image: transaction.dataValues.product.dataValues.image,
                price: transaction.price,
                tanggal: moment(transaction.dataValues.createdAt).format("DD MMMM YYYY"),
                status: transaction.dataValues.status,
            }
        })
        return TransactionHistory
    }

    static getHistoryRestoDetail = async(userID, transactionID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: searchUser.dataValues.user_id } })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        const searchTransaction = await Transaction.findOne({
            where: { transaction_id: transactionID },
            include: {
                model: Product,
                required: true,
                include: {
                    model: Resto,
                    required: true
                }
            }
        })
        if (!searchTransaction) throw new ResponseError(400, 'Transaksi Tidak Ada')
        const searchCustomer = await User.findOne({ where: { user_id: searchTransaction.dataValues.user_id } })
        if (!searchCustomer) throw new ResponseError(400, 'User Tidak Ada')
        const { kecamatan, kelurahan, alamat_lengkap: alamatLengkap } = searchCustomer.dataValues
        return {
            transactionID: searchTransaction.dataValues.transaction_id,
            price: searchTransaction.dataValues.price,
            namaCustomer: searchResto.dataValues.nama,
            alamatCustomer: `${alamatLengkap}, ${kelurahan}, ${kecamatan}`,
            status: searchTransaction.dataValues.status,
        }
    }

    static buyProduct = async(userID, request) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const { productID, price, type } = request
        const searchProduct = await Product.findOne({ where: { product_id: productID, active: true } })
        if (!searchProduct) throw new ResponseError(400, 'Produk Tidak Ada')
        const searchResto = await Resto.findOne({ where: { resto_id: searchProduct.dataValues.resto_id } })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        const beliBarangSendiri = searchResto.dataValues.user_id === searchUser.dataValues.user_id
        if (beliBarangSendiri) throw new ResponseError(400, 'Tidak Bisa Membeli Makanan Sendiri')
        if (searchProduct.dataValues.porsi === 0) throw new ResponseError(400, 'Produk Sudah Habis')
        const pembelian = {
            transaction_id: uuidv4().toString(),
            product_id: searchProduct.dataValues.product_id || productID,
            user_id: searchUser.dataValues.user_id || userID,
            price: type ? price : 0,
            type,
            status: 0,
            rating: 0,
        }
        const createTransaction = await Transaction.create(pembelian)
        if (!createTransaction) throw new ResponseError(400, 'Membeli Makanan Gagal')
        searchProduct.porsi = searchProduct.dataValues.porsi !== 0 ? searchProduct.dataValues.porsi - 1 : searchProduct.dataValues.porsi
        searchProduct.updatedAt = new Date()
        const updateProduct = await searchProduct.save()
        if (!updateProduct) throw new ResponseError(400, 'Update Produk Gagal')
        const dataNotificationUser = {
            user_id: searchUser.dataValues.user_id || userID,
            type: '0',
            title: 'Berhasil Membeli Makanan!',
            message: 'Selamat anda berhasil membeli makanan, semoga anda suka dengan makanannya!',
        }
        const pushNotificationUser = await NotificationService.postNotificationResto(dataNotificationUser)
        if (!pushNotificationUser) throw new ResponseError(400, 'Send Notification Gagal')
        const dataNotificationResto = {
            user_id: searchResto.dataValues.user_id,
            type: '0',
            title: 'Berhasil Menjualan Makanan!',
            message: 'Selamat makanan anda berhasil dibeli, silahkan cek Histori pembelian!',
        }
        const pushNotificationResto = await NotificationService.postNotificationResto(dataNotificationResto)
        if (!pushNotificationResto) throw new ResponseError(400, 'Send Notification Gagal')
        return { buy: true }
    }

    static ratingProduct = async(userID, transactionID, rating) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchTransaction = await Transaction.findOne({
            where: { transaction_id: transactionID, user_id: searchUser.dataValues.user_id }
        })
        if (!searchTransaction) throw new ResponseError(400, 'Transaksi Tidak Ada')
        if (searchTransaction.dataValues.rating > 0) throw new ResponseError(400, 'Rating Sudah Ada')
        if (searchTransaction.dataValues.status !== 2) throw new ResponseError(400, 'Transaksi Belum Selesai')
        searchTransaction.rating = rating || searchTransaction.dataValues.rating
        const updateTransaction = await searchTransaction.save()
        if (!updateTransaction) throw new ResponseError(400, 'Memberi Rating Makanan Gagal')
        const dataNotificationUser = {
            user_id: searchUser.dataValues.user_id || userID,
            type: '0',
            title: 'Memberi Rating Makanan Berhasil!',
            message: 'Selamat anda berhasil membeli rating pada makanan, Rating anda sangat membantu kami untuk meningkatkan pelayanan!',
        }
        const pushNotificationUser = await NotificationService.postNotificationResto(dataNotificationUser)
        if (!pushNotificationUser) throw new ResponseError(400, 'Send Notification Gagal')
        const dataNotificationResto = {
            user_id: searchResto.dataValues.user_id,
            type: '0',
            title: 'Makanan anda sudah di rating oleh customer',
            message: 'Makanan anda sudah di rating oleh customer, Semoga rating ini dapat membantu Restoran dalam mengembangkan pelayanan!',
        }
        const pushNotificationResto = await NotificationService.postNotificationResto(dataNotificationResto)
        if (!pushNotificationResto) throw new ResponseError(400, 'Send Notification Gagal')
        return { rating: true }
    }

    static rejectTransactionAsResto = async(userID, transactionID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchTransaction = await Transaction.findOne({
            where: {
                transaction_id: transactionID,
                status: {
                    [Op.lt]: 2
                }
            }
        })
        if (!searchTransaction) throw new ResponseError(400, 'Transaksi Tidak Ada')
        const searchResto = await Product.findOne({
            where: { product_id: searchTransaction.dataValues.product_id },
            include: { model: Resto, required: true, incude: { model: User, required: true, where: { user_id: userID } } }
        })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        searchTransaction.status = 4
        searchTransaction.updatedAt = new Date()
        const updateStatusTransaction = await searchTransaction.save()
        if (!updateStatusTransaction) throw new ResponseError(400, 'Update Status Gagal')
        const dataNotificationUser = {
            user_id: searchUser.dataValues.user_id || userID,
            type: '0',
            title: 'Maaf! Pesanan anda telah dibatalkan oleh Restoran',
            message: 'Sayang sekali pesanan anda telah dibatalkan oleh Restoran, silahkan cari makanan yang lainnya'
        }
        const pushNotificationUser = await NotificationService.postNotificationResto(dataNotificationUser)
        if (!pushNotificationUser) throw new ResponseError(400, 'Send Notification Gagal')
        const dataNotificationResto = {
            user_id: searchResto.dataValues.user_id,
            type: '0',
            title: 'Pesanan berhasil dibatalkan!',
            message: 'Pesanan customer telah anda batalkan.',
        }
        const pushNotificationResto = await NotificationService.postNotificationResto(dataNotificationResto)
        if (!pushNotificationResto) throw new ResponseError(400, 'Send Notification Gagal')
        return { reject: true }
    }

    static rejectTransactionAsUser = async(userID, transactionID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchTransaction = await Transaction.findOne({
            where: {
                transaction_id: transactionID,
                user_id: userID,
                status: {
                    [Op.lt]: 2

                }
            }
        })
        if (!searchTransaction) throw new ResponseError(400, 'Transaksi Tidak Ada')
        searchTransaction.status = 3
        searchTransaction.updatedAt = new Date()
        const updateStatusTransaction = await searchTransaction.save()
        if (!updateStatusTransaction) throw new ResponseError(400, 'Update Status Gagal')
        const dataNotificationUser = {
            user_id: searchUser.dataValues.user_id || userID,
            type: '0',
            title: 'Pesanan anda berhasil dibatalkan!',
            message: 'Pesanan anda telah berhasil dibatalkan, silahkan cari makanan yang lainnya'
        }
        const pushNotificationUser = await NotificationService.postNotificationResto(dataNotificationUser)
        if (!pushNotificationUser) throw new ResponseError(400, 'Send Notification Gagal')
        const dataNotificationResto = {
            user_id: searchResto.dataValues.user_id,
            type: '0',
            title: 'Pesanan telah dibatalkan oleh user',
            message: 'Pesanan anda telah berhasil dibatalkan oleh user, silahkan cari makanan yang lainnya',
        }
        const pushNotificationResto = await NotificationService.postNotificationResto(dataNotificationResto)
        if (!pushNotificationResto) throw new ResponseError(400, 'Send Notification Gagal')
        return { reject: true }
    }

    static putTransaction = async(userID, transactionID, status) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchTransaction = await Transaction.findOne({ where: { transaction_id: transactionID, status: status - 1 } })
        if (!searchTransaction) throw new ResponseError(400, 'Transaksi Tidak Ada')
        const searchResto = await Product.findOne({
            where: { product_id: searchTransaction.dataValues.product_id },
            include: { model: Resto, required: true, incude: { model: User, required: true, where: { user_id: userID } } }
        })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        searchTransaction.status = status ? status : searchTransaction.dataValues.status
        searchTransaction.updatedAt = new Date()
        const updateTransaction = searchTransaction.save()
        if (!updateTransaction) throw new ResponseError(400, 'Update Status Transaksi Gagal')
        return { status: true }
    }
}

module.exports = TransactionService