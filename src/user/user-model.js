const { Sequelize, DataTypes } = require('sequelize')
const { sequelize } = Sequelize
const database = require('../application/database.js')
const Alamat = require('./alamat-model.js')
const Notification = require('../notification/notification-model.js')

const User = database.define('user', {
    user_id: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING(6),
        allowNull: true,
    },
    username: {
        type: DataTypes.STRING(16),
        allowNull: true,
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    no_hp: {
        type: DataTypes.STRING(16),
        allowNull: true,
    },
    jenis_kelamin: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    tgl_lahir: {
        type: DataTypes.DATE,
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
}, { sequelize, modelName: 'user' })

User.hasOne(Alamat)
Alamat.belongsTo(User)

User.hasMany(Notification)
Notification.belongsTo(User)

module.exports = User