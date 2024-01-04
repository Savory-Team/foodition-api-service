const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')
const modelSync = require('../utils/model-sync.js')

const AuthRouter = require('../auth/auth-route.js')

const UserRouter = require('../user/user-route.js')
const RestoRouter = require('../restoran/resto-route.js')
const NotificationRouter = require('../notification/notification-route.js')
const ProductRouter = require('../product/product-route.js')

const UserModel = require('../user/user-model.js')
const RestoranModel = require('../restoran/resto-model.js')
const NotifikasiModel = require('../notification/notification-model.js')
const ProductModel = require('../product/product-model.js')

const app = express()
modelSync(false, [UserModel, RestoranModel, NotifikasiModel, ProductModel])
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

app.use(cors({
    origin: (origin, callback) => {
        callback(null, true)
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
}))

app.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT) || 120,
    handler: (req, res) => {
        return res.status(429).json({
            error: true,
            message: 'Terlalu banyak permintaan, silakan coba lagi setelah beberapa saat.'
        })
    }
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routing
app.use('/auth', AuthRouter)
app.use(UserRouter)
app.use(RestoRouter)
app.use(NotificationRouter)
app.use(ProductRouter)

app.get('/', (req, res) => {
    return res.status(200).json({
        Message: 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        Data: {
            Project: 'Foodition',
            Team: 'Savory',
            CreatedBy: 'Aditya Bayu',
            Copyright: '©2023 Foodition. All Rights Reserved.'
        }
    })
})

app.all('*', async(req, res) => res.redirect('/'))

module.exports = app