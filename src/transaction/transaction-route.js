const express = require('express')
const TransactionController = require('./transaction-controller.js')
const errorMiddleware = require('../middleware/error-middleware.js')
const Authentication = require('../middleware/authentication.js')

const TransactionRouting = express.Router()

TransactionRouting.get('/history/user', Authentication, TransactionController.getHistoryUser, errorMiddleware)
TransactionRouting.get('/history/user/:id', Authentication, TransactionController.getHistoryUserDetail, errorMiddleware)
TransactionRouting.get('/history/user/me', Authentication, TransactionController.getHistoryUserDetail, errorMiddleware)

TransactionRouting.get('/history/resto', Authentication, TransactionController.getHistoryResto, errorMiddleware)
TransactionRouting.get('/history/resto/:id', Authentication, TransactionController.getHistoryRestoDetail, errorMiddleware)
TransactionRouting.post('/buy', Authentication, TransactionController.buyProduct, errorMiddleware)
TransactionRouting.put('/rating/:id', Authentication, TransactionController.ratingProduct, errorMiddleware)
TransactionRouting.put('/reject/:id', Authentication, TransactionController.rejectTransaction, errorMiddleware)
TransactionRouting.put('/transaction/:id/:status', Authentication, TransactionController.putTransaction, errorMiddleware)

module.exports = TransactionRouting