import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the User model
const User = sequelize.define("User", {
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING },
  googleId: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "user" }, //user should be the only role for now
});

// creates table if it doesnt exist already
await sequelize.sync();

export default User;
