const { Sequelize, DataTypes } = require('sequelize')
const { sequelize } = Sequelize
const database = require('../application/database.js')

const Product = database.define('product', {
    product_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    resto_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    type: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    porsi: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kategori: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    }
}, { sequelize, modelName: 'product' })

module.exports = Product