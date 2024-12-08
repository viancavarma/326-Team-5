import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './expense-tracker.sqlite', // Path to SQLite database file
});

export default sequelize; // Provides a default export
