const { Sequelize, DataTypes } = require('sequelize')
const { sequelize } = Sequelize
const database = require('../application/database.js')
const Product = require('../product/product-model.js')

const Restoran = database.define('restoran', {
    resto_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    no_hp: {
        type: DataTypes.STRING(16),
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slogan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    deskripsi: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    label_alamat: {
        type: DataTypes.STRING,
        allowNull: true
    },
    negara: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    provinsi: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    kota_kab: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    kecamatan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    kelurahan: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    alamat_lengkap: {
        type: DataTypes.STRING,
        allowNull: true,
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
}, { sequelize, modelName: 'restoran' })

Product.belongsTo(Restoran, {
    foreignKey: 'resto_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
})

Restoran.hasMany(Product, { foreignKey: 'resto_id', })

module.exports = Restoran