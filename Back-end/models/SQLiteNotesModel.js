import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the Notes model
const Notes = sequelize.define("Notes", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// CRUD operations
class SQLiteNotesModel {
    async init(fresh = false) {
        await sequelize.authenticate();
        await sequelize.sync({ force: fresh });
    }   
    
    async create(notesData) {
        return await Notes.create(notesData);
    }

    async readAll(filters = {}) {
        const whereClause = {};
        if (filters.title) {
            whereClause.title = { [Sequelize.Op.like]: `%${filters.title}%` };
        }
        if (filters.content) {
            whereClause.content = { [Sequelize.Op.like]: `%${filters.content}%` };
        }
        return await Notes.findAll({ where: whereClause });
    }

    async readById(id) {
        return await Notes.findByPk(id);
    }

    async update(id, updatedData) {
        const notes = await Notes.findByPk(id);
        if (notes) {
            return await notes.update(updatedData);
        }
        return null;
    }

    async delete(id) {
        const notes = await Notes.findByPk(id);
        if (notes) {
            return await notes.destroy();
        }
        return null;
    }   
}

const notesModel = new SQLiteNotesModel();
export default notesModel;