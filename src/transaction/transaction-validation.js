const Joi = require('joi')

const BuyProductValidation = Joi.object({
    productID: Joi.string().max(255).required(),
    price: Joi.number().integer().positive().required(),
    type: Joi.number().integer().positive().required(),
})

const UserIDValidation = Joi.string().max(255).required()
const TransactionIDValidation = Joi.string().max(255).required()
const RatingValidation = Joi.number().integer().max(5).positive().required()

module.exports = {
    BuyProductValidation,
    UserIDValidation,
    TransactionIDValidation,
    RatingValidation,
    RatingValidation
}