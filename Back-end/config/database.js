import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './expense-tracker.sqlite', // Path to SQLite database file
  logging: false,
});

export default sequelize; // Provides a default export
