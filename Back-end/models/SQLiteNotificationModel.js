import { DataTypes } from 'sequelize';
import sequelize from './database.js';

const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

class SQLiteNotificationsModel {
    async init(fresh = false) {
        await sequelize.sync({ force: fresh });
    }
    
    async create(notificationData) {
        return await Notification.create(notificationData);
    }

    async readAll(userId) {
        return await Notification.findAll({ where: { userId } });
    }

    async updateAsRead(id) {
        const notification = await Notification.findByPk(id);
        return notification.update({ read: true });
    }
}

const notificationsModel = new SQLiteNotificationsModel();
export default notificationsModel;
