const express = require('express')
const ProductController = require('./product-controller.js')
const errorMiddleware = require('../middleware/error-middleware.js')
const Authentication = require('../middleware/authentication.js')
const upload = require('../utils/multer.js')

const ProductRouting = express.Router()

ProductRouting.get('/products/me', Authentication, ProductController.getMyProducts, errorMiddleware)
ProductRouting.post('/product', Authentication, upload.single('image'), ProductController.postProduct, errorMiddleware)
ProductRouting.put('/products/active/reset', ProductController.resetProductsActive, errorMiddleware)

module.exports = ProductRouting