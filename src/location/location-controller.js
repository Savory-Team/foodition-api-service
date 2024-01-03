const locationService = require('./location-service.js')

const getProvinsi = async(req, res, next) => {
    try {
        const result = await locationService.getProvinsi()
        return res.status(200).json({ error: false, message: 'GET Data Provinsi Berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const getKota = async(req, res, next) => {
    try {
        const id = req.params.id
        const result = await locationService.getKota(id)
        return res.status(200).json({ error: false, message: 'GET Data Kota Berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getProvinsi,
    getKota
}