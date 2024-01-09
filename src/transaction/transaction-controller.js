const TransactionService = require('./transaction-service.js')
const TransactionValidation = require('./transaction-validation.js')
const validate = require('../middleware/validation.js')
const ResponseError = require('../middleware/response-error.js')

class TransactionController {
    static getHistoryUser = async(req, res, next) => {
        try {
            const userID = req.userID
            const validUserID = validate(TransactionValidation.UserIDValidation, userID)
            const result = await TransactionService.getHistoryUser(validUserID)
            res.status(200).json({ error: false, Message: 'GET History Pembelian Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getHistoryUserDetail = async(req, res, next) => {
        try {
            const userID = req.userID
            const transactionID = req.params.id
            const validUserID = validate(TransactionValidation.UserIDValidation, userID)
            const validTransactionID = validate(TransactionValidation.TransactionIDValidation, transactionID)
            console.log({ validUserID, validTransactionID })
            const result = await TransactionService.getHistoryUserDetail(validUserID, validTransactionID)
            res.status(200).json({ error: false, Message: 'GET History Pembelian Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getHistoryResto = async(req, res, next) => {
        try {
            const userID = req.userID
            const validUserID = validate(TransactionValidation.UserIDValidation, userID)
            const result = await TransactionService.getHistoryResto(validUserID)
            res.status(200).json({ error: false, Message: 'GET History Penjualan Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static getHistoryRestoDetail = async(req, res, next) => {
        try {
            const userID = req.userID
            const transactionID = req.params.id
            const validUserID = validate(TransactionValidation.UserIDValidation, userID)
            const validTransactionID = validate(TransactionValidation.TransactionIDValidation, transactionID)
            const result = await TransactionService.getHistoryRestoDetail(validUserID, validTransactionID)
            res.status(200).json({ error: false, Message: 'GET History Penjualan Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static buyProduct = async(req, res, next) => {
        try {
            const userID = req.userID
            const buyRequest = req.body
            const validUserID = validate(TransactionValidation.UserIDValidation, userID)
            const validBuyRequest = validate(TransactionValidation.BuyProductValidation, buyRequest)
            const result = await TransactionService.buyProduct(validUserID, validBuyRequest)
            res.status(200).json({ error: false, Message: 'Membeli Makanan Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static ratingProduct = async(req, res, next) => {
        try {
            const userID = req.userID
            const transactionID = req.params.id
            const rating = parseInt(req.body.rating)
            const validUserID = validate(TransactionValidation.UserIDValidation, userID)
            const validTransactionID = validate(TransactionValidation.TransactionIDValidation, transactionID)
            const validRating = validate(TransactionValidation.RatingValidation, rating)
            const result = await TransactionService.ratingProduct(validUserID, validTransactionID, validRating)
            res.status(200).json({ error: false, Message: 'Memberi Rating Makanan Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }

    static rejectTransaction = async(req, res, next) => {
        try {
            const userID = req.userID
            const transactionID = req.params.id
            const sebagai = req.query.as
            const validUserID = validate(TransactionValidation.UserIDValidation, userID)
            const validTransactionID = validate(TransactionValidation.TransactionIDValidation, transactionID)
            if (sebagai === 'resto') {
                const result = await TransactionService.rejectTransactionAsResto(validUserID, validTransactionID)
                res.status(200).json({ error: false, Message: 'Membatalkan Pesanan Sebagai Restoran Berhasil', data: result })
            } else if (sebagai === 'user') {
                const result = await TransactionService.rejectTransactionAsUser(validUserID, validTransactionID)
                res.status(200).json({ error: false, Message: 'Membatalkan Pesanan Sebagai User Berhasil', data: result })
            } else {
                throw new ResponseError(400, 'Query Dibutuhkan')
            }
        } catch (error) {
            next(error)
        }
    }

    static putTransaction = async(req, res, next) => {
        try {
            const userID = req.userID
            const transactionID = req.params.id
            const status = parseInt(req.params.status)
            if (status !== 2 || status !== 3) throw new ResponseError(400, 'Status Pesanan Tidak Valid')
            const validUserID = validate(TransactionValidation.UserIDValidation, userID)
            const validTransactionID = validate(TransactionValidation.RatingValidation, transactionID)
            const result = await TransactionService.putTransaction(validUserID, validTransactionID, status)
            res.status(200).json({ error: false, Message: 'Updat Status Pesanan Berhasil', data: result })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = TransactionController