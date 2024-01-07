const Joi = require('joi')

const userID = Joi.string().max(255).required()
const productID = Joi.string().max(255).required()

module.exports = {
    userID,
    productID
}