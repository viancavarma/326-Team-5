import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// Define the Expense model
const Expense = sequelize.define("Expense", {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    primaryKey: true,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// CRUD operations
class SQLiteExpenseModel {
  async init(fresh = false) {
    await sequelize.authenticate();
    await sequelize.sync({ force: fresh });
  }

  async create(expenseData) {
    return await Expense.create(expenseData);
  }

  async readAll(filters = {}) {
    const whereClause = {};
    if (filters.date) {
      whereClause.date = filters.date;
    }
    if (filters.label) {
      whereClause.label = { [Sequelize.Op.like]: `%${filters.label}%` };
    }
    if (filters.amount) {
      whereClause.amount = filters.amount;
    }
    if (filters.category) {
      whereClause.category = filters.category;
    }
    return await Expense.findAll({ where: whereClause });
  }
  
  async readByDate(date) {
    return await Expense.findByPk(date);
  }

  async update(date, updatedData) {
    const expense = await Expense.findByPk(date);
    if (expense) {
      return await expense.update(updatedData);
    }
    return null;
  }

  async delete(date) {
    return await Expense.destroy({ where: { date } });
  }

  async findMostExpensive(){
    return await Expense.findOne({
      order:[['amount', 'DESC']],
    });
  }

  // sequelize query to get the most expensive category
  async findMostExpensiveCategory() {
    const result = await Expense.findAll({
      attributes: [
        'category', 
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_amount']
      ],
      group: ['category'],
      order: [[Sequelize.literal('total_amount'), 'DESC']],
      limit: 1,
    });
  
    return result.length > 0 ? result[0] : null; 
  }


}

const expenseModel = new SQLiteExpenseModel();

export default expenseModel;
export { Expense };
