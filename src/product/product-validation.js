const Joi = require('joi')

const PostProductValidation = Joi.object({
    status: Joi.boolean().required(),
    type: Joi.boolean().required(),
    porsi: Joi.number().integer().positive().required(),
    kategori: Joi.string().max(255).required(),
})

module.exports = {
    PostProductValidation
}