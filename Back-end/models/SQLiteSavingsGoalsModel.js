import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the SavingsGoal model
const SavingsGoal = sequelize.define("SavingsGoal", {
  goal_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  goal_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Goal name cannot be empty." },
    },
  },
  target_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  current_amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

// CRUD operations class
class SQLiteSavingsGoalsModel {
  async init(fresh = false) {
    await sequelize.authenticate();
    await sequelize.sync({ force: fresh }); // Syncs the database schema
    console.log("SavingsGoal table synced.");
  }

  // Create a new savings goal
  async create(goalData) {
    return await SavingsGoal.create(goalData);
  }

  // Retrieve all goals for a user with optional filters
  async readAll(filters = {}) {
    const whereClause = {};
    if (filters.user_id) whereClause.user_id = filters.user_id;
    if (filters.goal_name) {
      whereClause.goal_name = { [Sequelize.Op.like]: `%${filters.goal_name}%` };
    }
    return await SavingsGoal.findAll({ where: whereClause });
  }

  // Retrieve a specific goal by ID
  async readById(goal_id) {
    return await SavingsGoal.findByPk(goal_id);
  }

  // Update an existing savings goal
  async update(goal_id, updatedData) {
    const goal = await SavingsGoal.findByPk(goal_id);
    if (goal) {
      return await goal.update(updatedData);
    }
    return null;
  }

  // Delete a savings goal by ID
  async delete(goal_id) {
    return await SavingsGoal.destroy({ where: { goal_id } });
  }
}

// Instantiate the model
const savingsGoalsModel = new SQLiteSavingsGoalsModel();

export default savingsGoalsModel;
export { SavingsGoal };