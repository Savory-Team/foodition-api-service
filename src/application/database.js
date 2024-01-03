const Sequelize = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

const database = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        define: {
            timestamps: true
        }
    }
)

module.exports = database