const { Sequelize, DataTypes } = require('sequelize')
const { sequelize } = Sequelize
const database = require('../application/database.js')

const Notification = database.define('notification', {
    notification_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.STRING(16),
        allowNull: false,
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
}, { sequelize, modelName: 'notification' })

module.exports = Notification