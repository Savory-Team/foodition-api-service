const path = require('path')
const validate = require('../middleware/validation.js')
const RestoService = require('./resto-service.js')
const RestoValidation = require('./resto-validation.js')
const ResponseError = require('../middleware/response-error.js')

class RestoController {
    static getResto = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await RestoService.getResto(userID)
            res.status(200).json({ error: false, message: 'GET Restoran Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getDetailResto = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await RestoService.getDetailResto(userID)
            res.status(200).json({ error: false, message: 'GET Detail Restoran Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getAlamatResto = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await RestoService.getAlamatResto(userID)
            res.status(200).json({ error: false, message: 'GET Alamat Restoran Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getRestoMe = async(req, res, next) => {
        try {
            const userID = req.userID
            const result = await RestoService.getRestoMe(userID)
            res.status(200).json({ error: false, message: 'GET Restoran Berhasil', data: result })
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
            const result = await RestoService.updatePhoto(userID, filePath)
            res.status(200).json({ error: false, message: 'Ubah Foto Profile Restoran Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static putResto = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body
            const validRequest = validate(RestoValidation.putRestoValidation, request)
            const result = await RestoService.putResto(userID, validRequest)
            res.status(200).json({ error: false, message: 'Ubah Data Restoran Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static putAlamat = async(req, res, next) => {
        try {
            const userID = req.userID
            const request = req.body
            const validRequest = validate(RestoValidation.PutAlamatValidation, request)
            const result = await RestoService.putAlamat(userID, validRequest)
            res.status(200).json({ error: false, message: 'Ubah Alamat Restoran Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = RestoController