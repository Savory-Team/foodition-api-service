const Joi = require('joi')

const PutAlamatValidation = Joi.object({
    labelAlamat: Joi.string().max(32).required(),
    negara: Joi.string().max(255).required(),
    provinsi: Joi.string().max(255).required(),
    kotaKab: Joi.string().max(255).required(),
    kecamatan: Joi.string().max(255).required(),
    kelurahan: Joi.string().max(255).required(),
    alamatLengkap: Joi.string().max(255).required(),
})

const putRestoValidation = Joi.object({
    nama: Joi.string().max(255).required(),
    username: Joi.string().max(16).required(),
    noHp: Joi.string().max(16).required(),
    slogan: Joi.string().max(64).required(),
    deskripsi: Joi.string().max(255).required(),
})

module.exports = {
    PutAlamatValidation,
    putRestoValidation
}