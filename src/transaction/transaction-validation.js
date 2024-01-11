const Joi = require('joi')

const BuyProductValidation = Joi.object({
    productID: Joi.string().max(255).required(),
    price: Joi.number().integer().positive().required().allow(0),
    type: Joi.boolean().required(),
})

const UserIDValidation = Joi.string().max(255).required()
const TransactionIDValidation = Joi.string().max(255).required()
const RatingValidation = Joi.number().integer().max(5).positive().required()
const StatusValidation = Joi.number().integer().max(4).positive().required()

module.exports = {
    BuyProductValidation,
    UserIDValidation,
    TransactionIDValidation,
    RatingValidation,
    StatusValidation
}