const path = require('path')
const validate = require('../middleware/validation.js')
const UserService = require('./user-service.js')
const UserValidation = require('./user-validation.js')

class UserController {
    static getMyProfile = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await UserService.getMyProfile(userID)
            return res.status(200).json({ error: false, message: 'GET Profile Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getMyDetailProfile = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await UserService.getMyDetailProfile(userID)
            return res.status(200).json({ error: false, message: 'GET Detail Profile Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getMyProfileAndDetails = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await UserService.getMyProfileAndDetails(userID)
            return res.status(200).json({ error: false, message: 'GET Profile Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getMyAlamat = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await UserService.getMyAlamat(userID)
            return res.status(200).json({ error: false, message: 'GET Alamat Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getMyNama = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await UserService.getMyNama(userID)
            return res.status(200).json({ error: false, message: 'GET Nama Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getMyUsername = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await UserService.getMyUsername(userID)
            return res.status(200).json({ error: false, message: 'GET Username Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getMyBio = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await UserService.getMyBio(userID)
            return res.status(200).json({ error: false, message: 'GET Bio Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getMyNohp = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await UserService.getMyNohp(userID)
            return res.status(200).json({ error: false, message: 'GET Nomor Handphone Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getMyJenisKelamin = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await UserService.getMyJenisKelamin(userID)
            return res.status(200).json({ error: false, message: 'GET Jenis Kelamin Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getMyTanggalLahir = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await UserService.getMyTanggalLahir(userID)
            return res.status(200).json({ error: false, message: 'GET Tanggal Lahir Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static postAlamat = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body
            const validRequest = validate(UserValidation.AlamatValidation, request)
            const result = await UserService.postAlamat(userID, validRequest)
            return res.status(200).json({ error: false, message: 'Tambah Alamat Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static updatePhoto = async(req, res, next) => {
        try {
            const userID = req.userID
            const file = req.file
            if (!file) throw new ResponseError(400, 'Tidak ada foto yang diunggah')
            const filename = file.filename
            const filePath = path.join(__dirname, '../../uploads', filename)
            const result = await UserService.updatePhoto(userID, filePath)
            return res.status(200).json({ error: false, message: 'Ubah Foto Profile Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static forgotPassword = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body
            const validRequest = validate(UserValidation.ForgotPasswordValidation, request)
            const result = await UserService.forgotPassword(userID, validRequest)
            return res.status(200).json({ error: false, message: 'Ubah Password Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static putMyAlamat = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body
            const validRequest = validate(UserValidation.AlamatValidation, request)
            const result = await UserService.putMyAlamat(userID, validRequest)
            return res.status(200).json({ error: false, message: 'Ubah Alamat Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static putMyNama = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body.nama
            const validRequest = validate(UserValidation.NamaValidation, request)
            const result = await UserService.putMyNama(userID, validRequest)
            return res.status(200).json({ error: false, message: 'Ubah Nama Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static putMyUsername = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body.username
            const validRequest = validate(UserValidation.UsernameValidation, request)
            const result = await UserService.putMyUsername(userID, validRequest)
            return res.status(200).json({ error: false, message: 'Ubah Username Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static putMyBio = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body.bio
            const validRequest = validate(UserValidation.BioValidation, request)
            const result = await UserService.putMyBio(userID, validRequest)
            return res.status(200).json({ error: false, message: 'Ubah Bio Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static putMyNohp = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body.noHp
            const validRequest = validate(UserValidation.NomorHandphoneValidation, request)
            const result = await UserService.putMyNohp(userID, validRequest)
            return res.status(200).json({ error: false, message: 'Ubah Nomor Handphone Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static putMyJenisKelamin = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body.jenisKelamin
            const validRequest = validate(UserValidation.JenisKelaminValidation, request)
            const result = await UserService.putMyJenisKelamin(userID, validRequest)
            return res.status(200).json({ error: false, message: 'Ubah Jenis Kelamin Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static putMyTanggalLahir = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body.tanggalLahir
            const validRequest = validate(UserValidation.TanggalLahirValidation, request)
            const result = await UserService.putMyTanggalLahir(userID, validRequest)
            return res.status(200).json({ error: false, message: 'Ubah Tanggal Lahir Saya Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = UserController