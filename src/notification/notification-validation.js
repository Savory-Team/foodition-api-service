const Joi = require('joi')

const UserIDValidation = Joi.string().min(16).max(16).required()

const PostNotificationValidation = Joi.object({
    user_id: Joi.string().min(16).max(16).required(),
    type: Joi.string().min(1).max(1).required(),
    title: Joi.string().min(8).max(255).required(),
    message: Joi.string().min(8).max(255).required(),
})

module.exports = {
    UserIDValidation,
    PostNotificationValidation
}