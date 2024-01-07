const express = require('express')
const FavoriteController = require('./favorite-controller.js')
const errorMiddleware = require('../middleware/error-middleware.js')
const Authentication = require('../middleware/authentication.js')

const FavoriteRouting = express.Router()

FavoriteRouting.get('/favorites/me', Authentication, FavoriteController.getMyFavorites, errorMiddleware)
FavoriteRouting.post('/favorite/:id', Authentication, FavoriteController.postFavorite, errorMiddleware)
FavoriteRouting.delete('/favorite/id', Authentication, FavoriteController.deleteFavorite, errorMiddleware)

module.exports = FavoriteRouting