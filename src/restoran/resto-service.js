const path = require('path')
const fs = require('fs').promises
const { v4: uuidv4 } = require('uuid')
const { Storage } = require('@google-cloud/storage')
const ResponseError = require('../middleware/response-error.js')
const User = require('../user/user-model.js')
const Resto = require('./resto-model.js')
const Product = require('../product/product-model.js')
const NotificationService = require('../notification/notification-service.js')
const operator = require('indonesia-number-provider-checker').operator


const keyFilename = path.join(__dirname, '../../credentials/storage-admin-key.json')
const GCS = new Storage({ keyFilename })
const bucketName = process.env.BUCKET_NAME || 'BUCKET_NAME'

class RestoService {
    static getResto = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const checkNomorHp = searchUser.dataValues.no_hp
        if (!checkNomorHp) throw new ResponseError(400, 'Biodatamu Belum Lengkap')
        const searchResto = await Resto.findOne({ where: { user_id: userID } })
        if (searchResto) {
            const countProductsResto = await Product.count({ where: { resto_id: searchResto.dataValues.resto_id } })
            return {
                restoID: searchResto.dataValues.resto_id ? searchResto.dataValues.resto_id : null,
                userID: searchResto.dataValues.user_id ? searchResto.dataValues.user_id : null,
                image: searchResto.dataValues.image ? searchResto.dataValues.image : null,
                nama: searchResto.dataValues.nama ? searchResto.dataValues.nama : null,
                noHp: searchResto.dataValues.no_hp ? searchResto.dataValues.no_hp : null,
                slogan: searchResto.dataValues.slogan ? searchResto.dataValues.slogan : null,
                totalProduct: countProductsResto ? countProductsResto : 0
            }
        }
        const defaultPhoto = 'https://storage.googleapis.com/savory/api-service/user/default-user-image.png'
        const newRestoran = {
            resto_id: uuidv4().toString(),
            user_id: userID,
            nama: `Restoran ${searchUser.dataValues.nama}`,
            no_hp: searchUser.dataValues.no_hp,
            image: defaultPhoto,
        }
        const createResto = await Resto.create(newRestoran)
        if (!createResto) throw new ResponseError(400, 'Restoran Gagal Dibuat')
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Restoran berhasil dibuat',
            message: 'Selamat, restoran anda berhasil dibuat. Sekarang anda bisa menjual makanan.',
        }
        const pushNotification = await NotificationService.postNotificationResto(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return {
            restoID: newRestoran.resto_id ? newRestoran.resto_id : null,
            userID: newRestoran.user_id ? newRestoran.user_id : null,
            image: defaultPhoto ? defaultPhoto : null,
            nama: newRestoran.nama ? newRestoran.nama : null,
            noHp: newRestoran.no_hp ? newRestoran.no_hp : null,
            slogan: null,
            totalProduct: 0
        }
    }

    static getDetailResto = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: userID } })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        return {
            image: searchResto.dataValues.image ? searchResto.dataValues.image : null,
            nama: searchResto.dataValues.nama ? searchResto.dataValues.nama : null,
            username: searchResto.dataValues.username ? searchResto.dataValues.username : null,
            noHp: searchResto.dataValues.no_hp ? searchResto.dataValues.no_hp : null,
            slogan: searchResto.dataValues.slogan ? searchResto.dataValues.slogan : null,
            deskripsi: searchResto.dataValues.deskripsi ? searchResto.dataValues.deskripsi : null,
        }
    }

    static getAlamatResto = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: userID } })
        if (!searchResto) throw new ResponseError(400, 'Restoran Tidak Ada')
        return {
            labelAlamat: searchResto.dataValues.label_alamat ? searchResto.dataValues.label_alamat : null,
            negara: searchResto.dataValues.negara ? searchResto.dataValues.negara : null,
            provinsi: searchResto.dataValues.provinsi ? searchResto.dataValues.provinsi : null,
            kotaKab: searchResto.dataValues.kota_kab ? searchResto.dataValues.kota_kab : null,
            kecamatan: searchResto.dataValues.kecamatan ? searchResto.dataValues.kecamatan : null,
            kelurahan: searchResto.dataValues.kelurahan ? searchResto.dataValues.kelurahan : null,
            alamatLengkap: searchResto.dataValues.alamat_lengkap ? searchResto.dataValues.alamat_lengkap : null,
        }
    }

    static getRestoMe = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const checkNomorHp = searchUser.dataValues.no_hp
        if (!checkNomorHp) throw new ResponseError(400, 'Biodatamu Belum Lengkap')
        const searchResto = await Resto.findOne({ where: { user_id: userID } })
        if (searchResto) {
            const countProductsResto = await Product.count({ where: { resto_id: searchResto.dataValues.resto_id } })
            return {
                restoID: searchResto.dataValues.resto_id ? searchResto.dataValues.resto_id : null,
                userID: searchResto.dataValues.user_id ? searchResto.dataValues.user_id : null,
                image: searchResto.dataValues.image ? searchResto.dataValues.image : null,
                nama: searchResto.dataValues.nama ? searchResto.dataValues.nama : null,
                noHp: searchResto.dataValues.no_hp ? searchResto.dataValues.no_hp : null,
                slogan: searchResto.dataValues.slogan ? searchResto.dataValues.slogan : null,
                totalProduct: countProductsResto ? countProductsResto : 0,
                username: searchResto.dataValues.username ? searchResto.dataValues.username : null,
                noHp: searchResto.dataValues.no_hp ? searchResto.dataValues.no_hp : null,
                deskripsi: searchResto.dataValues.deskripsi ? searchResto.dataValues.deskripsi : null,
                labelAlamat: searchResto.dataValues.label_alamat ? searchResto.dataValues.label_alamat : null,
                negara: searchResto.dataValues.negara ? searchResto.dataValues.negara : null,
                provinsi: searchResto.dataValues.provinsi ? searchResto.dataValues.provinsi : null,
                kotaKab: searchResto.dataValues.kota_kab ? searchResto.dataValues.kota_kab : null,
                kecamatan: searchResto.dataValues.kecamatan ? searchResto.dataValues.kecamatan : null,
                kelurahan: searchResto.dataValues.kelurahan ? searchResto.dataValues.kelurahan : null,
                alamatLengkap: searchResto.dataValues.alamat_lengkap ? searchResto.dataValues.alamat_lengkap : null,
            }
        }
        const defaultPhoto = 'https://storage.googleapis.com/savory/api-service/user/default-user-image.png'
        const newRestoran = {
            resto_id: uuidv4().toString(),
            user_id: userID,
            nama: `Restoran ${searchUser.dataValues.nama}`,
            no_hp: searchUser.dataValues.no_hp,
            image: defaultPhoto,
        }
        const createResto = await Resto.create(newRestoran)
        if (!createResto) throw new ResponseError(400, 'Restoran Gagal Dibuat')
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Restoran berhasil dibuat',
            message: 'Selamat, restoran anda berhasil dibuat. Sekarang anda bisa menjual makanan.',
        }
        const pushNotification = await NotificationService.postNotificationResto(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return {
            restoID: newRestoran.resto_id ? newRestoran.resto_id : null,
            userID: newRestoran.user_id ? newRestoran.user_id : null,
            image: defaultPhoto ? defaultPhoto : null,
            nama: newRestoran.nama ? newRestoran.nama : null,
            noHp: newRestoran.no_hp ? newRestoran.no_hp : null,
            slogan: null,
            totalProduct: 0,

            restoID: searchResto._previousDataValues.resto_id ? searchResto._previousDataValues.resto_id : null,
            userID: searchResto._previousDataValues.user_id ? searchResto._previousDataValues.user_id : null,
            nama: searchResto._previousDataValues.nama ? searchResto._previousDataValues.nama : null,
            noHp: searchResto._previousDataValues.no_hp ? searchResto._previousDataValues.no_hp : null,
            image: searchResto._previousDataValues.image ? searchResto._previousDataValues.image : null,
            username: searchResto._previousDataValues.username ? searchResto._previousDataValues.username : null,
            slogan: searchResto._previousDataValues.slogan ? searchResto._previousDataValues.slogan : null,
            deskripsi: searchResto._previousDataValues.deskripsi ? searchResto._previousDataValues.deskripsi : null,
            totalProduct: countProductsResto ? countProductsResto : 0,
            labelAlamat: searchResto._previousDataValues.label_alamat ? searchResto._previousDataValues.label_alamat : null,
            negara: searchResto._previousDataValues.negara ? searchResto._previousDataValues.negara : null,
            provinsi: searchResto._previousDataValues.provinsi ? searchResto._previousDataValues.provinsi : null,
            kotaKab: searchResto._previousDataValues.kota_kab ? searchResto._previousDataValues.kota_kab : null,
            kecamatan: searchResto._previousDataValues.kecamatan ? searchResto._previousDataValues.kecamatan : null,
            kelurahan: searchResto._previousDataValues.kelurahan ? searchResto._previousDataValues.kelurahan : null,
            alamatLengkap: searchResto._previousDataValues.alamat_lengkap ? searchResto._previousDataValues.alamat_lengkap : null,
        }
    }

    static updatePhoto = async(userID, filePath) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const fileName = path.basename(filePath)
        const destFileName = `api-service/user/${fileName}`
        await GCS.bucket(bucketName).upload(filePath, { destination: destFileName, })
        const url = `https://storage.googleapis.com/${bucketName}/${destFileName}`
        searchUser.image = url
        searchUser.updatedAt = new Date()
        const updatedUser = await searchUser.save()
        if (!updatedUser) throw new ResponseError(400, 'Update Foto Profile Gagal')
        fs.unlink(filePath)
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Berhasil mengubah foto profile restoran anda',
            message: 'Mengubah foto profile renstoran anda berhasil.',
        }
        const pushNotification = await NotificationService.postNotificationResto(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return {
            userID: updatedUser.dataValues.userID,
            image: updatedUser.dataValues.image
        }
    }

    static putResto = async(userID, request) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Restoran Tidak Ada')
        const noHp = request
        const providerValid = operator(request.noHp)
        if (providerValid === 'Unknown') throw new ResponseError(400, 'Nomor Telepone Tidak Valid')
        if (noHp[0] === '0') {
            request['noHp'] = noHp.replace(/^0+/, '')
        } else if (noHp[0] === '6') {
            request['noHp'] = noHp.replace(/^62+/, '')
        }
        searchResto.no_hp = request.noHp ? request.noHp : searchResto.dataValues.no_hp
        searchResto.nama = request.nama ? request.nama : searchResto.dataValues.nama
        searchResto.username = request.username ? request.username : searchResto.dataValues.username
        searchResto.slogan = request.slogan ? request.slogan : searchResto.dataValues.slogan
        searchResto.deskripsi = request.deskripsi ? request.deskripsi : searchResto.dataValues.deskripsi
        searchResto.updatedAt = new Date()
        const updateDataResto = await searchResto.save()
        if (!updateDataResto) throw new ResponseError(400, 'Ubah Data Restoran Gagal')
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Berhasil mengubah Data Restoran anda!',
            message: 'Mengubah data restoran anda berhasil. Silahkan cek data restoran anda.',
        }
        const pushNotification = await NotificationService.postNotificationResto(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return true
    }

    static putAlamat = async(userID, request) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const searchResto = await Resto.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Restoran Tidak Ada')
        searchResto.label_alamat = request.labelAlamat ? request.labelAlamat : searchResto.dataValues.label_alamat
        searchResto.negara = request.negara ? request.negara : searchResto.dataValues.negara
        searchResto.provinsi = request.provinsi ? request.provinsi : searchResto.dataValues.provinsi
        searchResto.kota_kab = request.kotaKab ? request.kotaKab : searchResto.dataValues.kota_kab
        searchResto.kecamatan = request.kecamatan ? request.kecamatan : searchResto.dataValues.kecamatan
        searchResto.kelurahan = request.kelurahan ? request.kelurahan : searchResto.dataValues.kelurahan
        searchResto.alamat_lengkap = request.alamatLengkap ? request.alamatLengkap : searchResto.dataValues.alamat_lengkap
        searchResto.updatedAt = new Date()
        const updateAlamatResto = await searchResto.save()
        if (!updateAlamatResto) throw new ResponseError(400, 'Ubah Alamat Restoran Gagal')
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Berhasil mengubah Alamat Restoran anda!',
            message: 'Mengubah alamat restoran anda berhasil. Silahkan cek alamat restoran anda.',
        }
        const pushNotification = await NotificationService.postNotificationResto(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return true
    }
}

module.exports = RestoService