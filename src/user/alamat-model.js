const { Sequelize, DataTypes } = require('sequelize')
const { sequelize } = Sequelize
const database = require('../application/database.js')

const Alamat = database.define('alamat', {
    alamat_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    user_resto_id: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true,
    },
    label_alamat: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },
    negara: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    provinsi: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: false,
    },
    kota_kab: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kecamatan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    kelurahan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    alamat_lengkap: {
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
}, { sequelize, modelName: 'alamat' })

module.exports = Alamat