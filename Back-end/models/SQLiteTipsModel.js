import { Sequelize, DataTypes } from "sequelize";
import sequelize from '../config/database.js';

// comment structure

// define tip model
const Tips = sequelize.define("SavingsGoal", {
    tip: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
})