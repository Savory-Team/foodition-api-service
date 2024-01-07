const path = require('path')
const fs = require('fs').promises
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const { Storage } = require('@google-cloud/storage')
const ResponseError = require('../middleware/response-error')
const User = require('./user-model.js')
const NotificationService = require('../notification/notification-service.js')
const operator = require('indonesia-number-provider-checker').operator

const keyFilename = path.join(__dirname, '../../credentials/storage-admin-key.json')
const GCS = new Storage({ keyFilename })
const bucketName = process.env.BUCKET_NAME || 'BUCKET_NAME'

class UserService {
    static getMyProfile = async(userID) => {
        const searchMyProfile = await User.findOne({ where: { user_id: userID } })
        if (!searchMyProfile) throw new ResponseError(400, 'User Tidak Ada')
        const isActive = searchMyProfile.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        return {
            userID: searchMyProfile.dataValues.user_id,
            nama: searchMyProfile.dataValues.nama,
            email: searchMyProfile.dataValues.email,
            image: searchMyProfile.dataValues.image,
        }
    }

    static getMyDetailProfile = async(userID) => {
        const searchMyProfile = await User.findOne({ where: { user_id: userID } })
        if (!searchMyProfile) throw new ResponseError(400, 'User Tidak Ada')
        const isActive = searchMyProfile.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        return {
            image: searchMyProfile.dataValues.image ? searchMyProfile.dataValues.image : null,
            nama: searchMyProfile.dataValues.nama ? searchMyProfile.dataValues.nama : null,
            username: searchMyProfile.dataValues.username ? searchMyProfile.dataValues.username : null,
            bio: searchMyProfile.dataValues.bio ? searchMyProfile.dataValues.bio : null,
            userID: searchMyProfile.dataValues.user_id ? searchMyProfile.dataValues.user_id : null,
            email: searchMyProfile.dataValues.email ? searchMyProfile.dataValues.email : null,
            no_hp: searchMyProfile.dataValues.no_hp ? searchMyProfile.dataValues.no_hp : null,
            jenis_kelamin: searchMyProfile.dataValues.jenis_kelamin ? searchMyProfile.dataValues.jenis_kelamin : null,
            tgl_lahir: searchMyProfile.dataValues.tgl_lahir ? searchMyProfile.dataValues.tgl_lahir : null,
        }
    }

    static getMyAlamat = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        return {
            labelAlamat: searchUser.dataValues.labelAlamat ? searchUser.dataValues.labelAlamat : null,
            negara: searchUser.dataValues.negara ? searchUser.dataValues.negara : null,
            provinsi: searchUser.dataValues.provinsi ? searchUser.dataValues.provinsi : null,
            kotaKab: searchUser.dataValues.kota_kab ? searchUser.dataValues.kota_kab : null,
            kecamatan: searchUser.dataValues.kecamatan ? searchUser.dataValues.kecamatan : null,
            kelurahan: searchUser.dataValues.kelurahan ? searchUser.dataValues.kelurahan : null,
            alamatLengkap: searchUser.dataValues.alamat_lengkap ? searchUser.dataValues.alamat_lengkap : null,
        }
    }

    static getMyNama = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        return { nama: searchUser.dataValues.nama }
    }

    static getMyUsername = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        return { username: searchUser.dataValues.username }
    }

    static getMyBio = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        return { bio: searchUser.dataValues.bio }
    }

    static getMyNohp = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        return { noHp: searchUser.dataValues.no_hp ? `0${searchUser.dataValues.no_hp}` : searchUser.dataValues.no_hp }
    }

    static getMyJenisKelamin = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        return { jenisKelamin: searchUser.dataValues.jenis_kelamin }
    }

    static getMyTanggalLahir = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        return { tanggalLahir: searchUser.dataValues.tgl_lahir }
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
        const updatedUser = await searchUser.save()
        if (!updatedUser) throw new ResponseError(400, 'Update Foto Profile Gagal')
        fs.unlink(filePath)
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Berhasil mengubah foto profile anda',
            message: 'Mengubah foto profile akun anda berhasil, sekarang fotomu makin kece lagi!',
        }
        const pushNotification = await NotificationService.postNotificationUser(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return {
            userID: updatedUser.dataValues.userID,
            image: updatedUser.dataValues.image
        }
    }

    static forgotPassword = async(userID, request) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const matchPassword = request.newPassword === request.oldPassword
        if (matchPassword) throw new ResponseError(400, 'New Password dan Confirm New Password Tidak Sesuai')
        const checkPassword = await bcrypt.compare(request.oldPassword, searchUser.dataValues.password)
        if (!checkPassword) throw new ResponseError(400, 'Password Lama Salah')
        const SALT = Number(process.env.SALT) || 12
        const hashPassword = await bcrypt.hash(request.newPassword, SALT)
        searchUser.password = hashPassword
        const updatePassword = await searchUser.save()
        if (!updatePassword) throw new ResponseError(400, 'Ubah Password Gagal')
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Berhasil mengubah password anda!',
            message: 'Password berhasil diubah. Gunakan password baru untuk login',
        }
        const pushNotification = await NotificationService.postNotificationUser(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return true
    }

    static putMyAlamat = async(userID, request) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        searchUser.label_alamat = request.labelAlamat ? request.labelAlamat : searchUser.dataValues.label_alamat
        searchUser.negara = request.negara ? request.negara : searchUser.dataValues.negara
        searchUser.provinsi = request.provinsi ? request.provinsi : searchUser.dataValues.provinsi
        searchUser.kota_kab = request.kotaKab ? request.kotaKab : searchUser.dataValues.kota_kab
        searchUser.kecamatan = request.kecamatan ? request.kecamatan : searchUser.dataValues.kecamatan
        searchUser.kelurahan = request.kelurahan ? request.kelurahan : searchUser.dataValues.kelurahan
        searchUser.alamat_lengkap = request.alamatLengkap ? request.alamatLengkap : searchUser.dataValues.alamat_lengkap
        searchUser.updatedAt = new Date()
        const ubahAlamat = await searchUser.save()
        if (!ubahAlamat) throw new ResponseError(400, 'Ubah Alamat Gagal')
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Berhasil telah mengubah Alamat anda!',
            message: 'Alamat berhasil diubah.'
        }
        const pushNotification = await NotificationService.postNotificationUser(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return true
    }

    static putMyNama = async(userID, request) => {
        try {
            const searchUser = await User.findOne({ where: { user_id: userID } })
            if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
            const isActive = searchUser.dataValues.active
            if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
            searchUser.nama = request ? request : searchUser.dataValues.nama
            searchUser.updatedAt = new Date()
            const ubahNama = await searchUser.save()
            if (!ubahNama) throw new ResponseError(400, 'Ubah Nama Gagal')
            const dataNotification = {
                user_id: userID,
                type: '0',
                title: 'Berhasil telah mengubah Nama anda!',
                message: 'Nama berhasil diubah.'
            }
            const pushNotification = await NotificationService.postNotificationUser(dataNotification)
            if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
            return true
        } catch (error) {
            next(error)
        }
    }

    static putMyUsername = async(userID, request) => {
        try {
            const searchUser = await User.findOne({ where: { user_id: userID } })
            if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
            const isActive = searchUser.dataValues.active
            if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
            searchUser.username = request ? request : searchUser.dataValues.username
            searchUser.updatedAt = new Date()
            const ubahUsername = await searchUser.save()
            if (!ubahUsername) throw new ResponseError(400, 'Ubah Username Gagal')
            const dataNotification = {
                user_id: userID,
                type: '0',
                title: 'Berhasil telah mengubah Username anda!',
                message: 'Username berhasil diubah.'
            }
            const pushNotification = await NotificationService.postNotificationUser(dataNotification)
            if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
            return true
        } catch (error) {
            next(error)
        }
    }

    static putMyBio = async(userID, request) => {
        try {
            const searchUser = await User.findOne({ where: { user_id: userID } })
            if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
            const isActive = searchUser.dataValues.active
            if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
            searchUser.bio = request ? request : searchUser.dataValues.bio
            searchUser.updatedAt = new Date()
            const ubahBio = await searchUser.save()
            if (!ubahBio) throw new ResponseError(400, 'Ubah Bio Gagal')
            const dataNotification = {
                user_id: userID,
                type: '0',
                title: 'Berhasil telah mengubah Bio anda!',
                message: 'Bio berhasil diubah.'
            }
            const pushNotification = await NotificationService.postNotificationUser(dataNotification)
            if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
            return true
        } catch (error) {
            next(error)
        }
    }

    static putMyNohp = async(userID, request) => {
        try {
            const searchUser = await User.findOne({ where: { user_id: userID } })
            if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
            const isActive = searchUser.dataValues.active
            if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
            const providerValid = operator(request)
            if (providerValid === 'Unknown') throw new ResponseError(400, 'Nomor Telepone Tidak Valid')
            if (request[0] === '0') {
                request = request.replace(/^0+/, '')
            } else if (request[0] === '6') {
                request = request.replace(/^62+/, '')
            }
            searchUser.no_hp = request ? request : searchUser.dataValues.no_hp
            searchUser.updatedAt = new Date()
            const ubahNomorHp = await searchUser.save()
            if (!ubahNomorHp) throw new ResponseError(400, 'Ubah Nomor Handphone Gagal')
            const dataNotification = {
                user_id: userID,
                type: '0',
                title: 'Berhasil telah mengubah Nomor Handphone anda!',
                message: 'Nomor Handphone berhasil diubah.'
            }
            const pushNotification = await NotificationService.postNotificationUser(dataNotification)
            if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
            return true
        } catch (error) {
            next(error)
        }
    }

    static putMyJenisKelamin = async(userID, request) => {
        try {
            const searchUser = await User.findOne({ where: { user_id: userID } })
            if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
            const isActive = searchUser.dataValues.active
            if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
            searchUser.jenis_kelamin = request ? request : searchUser.dataValues.jenis_kelamin
            searchUser.updatedAt = new Date()
            const ubahJenisKelamin = await searchUser.save()
            if (!ubahJenisKelamin) throw new ResponseError(400, 'Ubah Jenis Kelamin Gagal')
            const dataNotification = {
                user_id: userID,
                type: '0',
                title: 'Berhasil telah mengubah Jenis Kelamin anda!',
                message: 'Jenis Kelamin berhasil diubah.'
            }
            const pushNotification = await NotificationService.postNotificationUser(dataNotification)
            if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
            return true
        } catch (error) {
            next(error)
        }
    }

    static putMyTanggalLahir = async(userID, request) => {
        try {
            const searchUser = await User.findOne({ where: { user_id: userID } })
            if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
            const isActive = searchUser.dataValues.active
            if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
            searchUser.tgl_lahir = request ? request : searchUser.dataValues.tgl_lahir
            searchUser.updatedAt = new Date()
            const ubahTanggalLahir = await searchUser.save()
            if (!ubahTanggalLahir) throw new ResponseError(400, 'Ubah Tanggal Lahir Gagal')
            const dataNotification = {
                user_id: userID,
                type: '0',
                title: 'Berhasil telah mengubah Tanggal Lahir anda!',
                message: 'Tanggal Lahir berhasil diubah.'
            }
            const pushNotification = await NotificationService.postNotificationUser(dataNotification)
            if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
            return true
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserService