const Joi = require('joi')

const AlamatValidation = Joi.object({
    labelAlamat: Joi.string().max(32).required(),
    negara: Joi.string().max(255).required(),
    provinsi: Joi.string().max(255).required(),
    kotaKab: Joi.string().max(255).required(),
    kecamatan: Joi.string().max(255).required(),
    kelurahan: Joi.string().max(255).required(),
    alamatLengkap: Joi.string().max(255).required(),
})

const ForgotPasswordValidation = Joi.object({
    oldPassword: Joi.string().max(32).required(),
    newPassword: Joi.string().max(32).required(),
    confirmNewPassword: Joi.string().max(32).required(),
})

const NamaValidation = Joi.string().max(255).required()
const UsernameValidation = Joi.string().max(16).required()
const BioValidation = Joi.string().max(255).required()
const NomorHandphoneValidation = Joi.string().max(16).required()
const JenisKelaminValidation = Joi.boolean().required()
const TanggalLahirValidation = Joi.date().iso().optional().allow('')

module.exports = {
    AlamatValidation,
    ForgotPasswordValidation,
    NamaValidation,
    UsernameValidation,
    BioValidation,
    NomorHandphoneValidation,
    JenisKelaminValidation,
    TanggalLahirValidation
}