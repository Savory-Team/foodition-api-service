const { Sequelize, DataTypes } = require('sequelize')
const { sequelize } = Sequelize
const database = require('../application/database.js')

const NotificationResto = database.define('notification-restoran', {
    notification_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    resto_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'restorans',
            key: 'resto_id',
        },
    },
    type: {
        type: DataTypes.STRING(1),
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
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
}, { sequelize, modelName: 'notification-restoran' })

module.exports = NotificationResto