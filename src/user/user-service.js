const ResponseError = require('../middleware/response-error')
const User = require('./user-model.js')
const Alamat = require('./alamat-model.js')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')

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
            image: searchMyProfile.dataValues.image,
            nama: searchMyProfile.dataValues.nama,
            username: searchMyProfile.dataValues.username ? searchMyProfile.dataValues.username : null,
            bio: searchMyProfile.dataValues.bio ? searchMyProfile.dataValues.bio : null,
            userID: searchMyProfile.dataValues.user_id,
            email: searchMyProfile.dataValues.email,
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
        const searchMyAlamat = await Alamat.findOne({ where: { user_resto_id: userID } })
        if (!searchMyAlamat) throw new ResponseError(404, 'Alamat Tidak Ada')
        return searchMyAlamat
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
        return { no_hp: searchUser.dataValues.no_hp }
    }

    static getMyJenisKelamin = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        return { jenis_kelamin: searchUser.dataValues.jenis_kelamin }
    }

    static getMyTanggalLahir = async(userID) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        return { tgl_lahir: searchUser.dataValues.tgl_lahir }
    }

    static postAlamat = async(userID, request) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const alamatID = uuidv4().toString()
        const newAlamat = {
            alamat_id: alamatID,
            user_resto_id: userID,
            label_alamat: request.labelAlamat,
            negara: request.negara,
            provinsi: request.provinsi,
            kota_kab: request.kotaKab,
            kecamatan: request.kecamatan,
            kelurahan: request.kelurahan,
            alamat_lengkap: request.alamatLengkap,
        }
        const createAlamat = await Alamat.create(newAlamat)
        if (!createAlamat) throw new ResponseError(400, 'Tambah Alamat Gagal')
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Alamat berhasil ditambahkan',
            message: 'Selamat anda telah menambahkan Alamat! Pengalaman lebih baik lagi akan anda rasakan.'
        }
        const pushNotification = await NotificationService.postNotification(dataNotification)
        if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
        return true
    }

    static forgotPassword = async(userID, request) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const matchPassword = request.newPassword === request.oldPassword
        if (!matchPassword) throw new ResponseError(400, 'New Password dan Confirm New Password Tidak Sesuai')
        const checkPassword = await bcrypt.compare(request.oldPassword, searchUser.dataValues.password)
        if (!checkPassword) throw new ResponseError(400, 'Password Lama Salah')
        const SALT = process.env.SALT || 12
        const hashPassword = await bcrypt.hash(request.newPassword, SALT)
        searchUser.password = hashPassword
        const updatePassword = await searchUser.save()
        if (!updatePassword) throw new ResponseError(400, 'Ubah Password Gagal')
        return true
    }

    static putMyAlamat = async(userID, request) => {
        const searchUser = await User.findOne({ where: { user_id: userID } })
        if (!searchUser) throw new ResponseError(400, 'Akun Tidak Ada')
        const isActive = searchUser.dataValues.active
        if (!isActive) throw new ResponseError(400, 'Akun Belum Aktif')
        const checkAlamat = await Alamat.findOne({ where: { user_resto_id: userID } })
        if (!checkAlamat) throw new ResponseError(400, 'Alamat Tidak Ada')
        checkAlamat.label_alamat = request.labelAlamat ? request.labelAlamat : checkAlamat.dataValues.label_alamat
        checkAlamat.negara = request.negara ? request.negara : checkAlamat.dataValues.negara
        checkAlamat.provinsi = request.provinsi ? request.provinsi : checkAlamat.dataValues.provinsi
        checkAlamat.kota_kab = request.kotaKab ? request.kotaKab : checkAlamat.dataValues.kota_kab
        checkAlamat.kecamatan = request.kecamatan ? request.kecamatan : checkAlamat.dataValues.kecamatan
        checkAlamat.kelurahan = request.kelurahan ? request.kelurahan : checkAlamat.dataValues.kelurahan
        checkAlamat.alamat_lengkap = request.alamatLengkap ? request.alamatLengkap : checkAlamat.dataValues.alamat_lengkap
        checkAlamat.updatedAt = new Date()
        const ubahAlamat = await checkAlamat.save()
        if (!ubahAlamat) throw new ResponseError(400, 'Ubah Alamat Gagal')
        const dataNotification = {
            user_id: userID,
            type: '0',
            title: 'Berhasil telah mengubah Alamat anda!',
            message: 'Alamat berhasil diubah.'
        }
        const pushNotification = await NotificationService.postNotification(dataNotification)
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
            const pushNotification = await NotificationService.postNotification(dataNotification)
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
            const pushNotification = await NotificationService.postNotification(dataNotification)
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
            const pushNotification = await NotificationService.postNotification(dataNotification)
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
            const pushNotification = await NotificationService.postNotification(dataNotification)
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
            const pushNotification = await NotificationService.postNotification(dataNotification)
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
            const pushNotification = await NotificationService.postNotification(dataNotification)
            if (!pushNotification) throw new ResponseError(400, 'Send Notification Gagal')
            return true
        } catch (error) {
            next(error)
        }
    }


}

module.exports = UserService