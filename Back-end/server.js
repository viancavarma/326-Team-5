import express from 'express';
import dotenv from 'dotenv';
import expenseRoutes from './routes/ExpenseRoutes.js';
import expenseModel from './models/SQLiteExpenseModel.js';
import wishlistRoutes from './routes/WishlistRoutes.js';
import notesRoutes from './routes/NotesRoutes.js';
import tipsRoutes from './routes/tipsRoutes.js';
import sequelize from './config/database.js';
import customTipsModel from './models/SQLiteTipsModel.js';
import customTipsRoutes from './routes/CustomTipsRoutes.js';
import savingsGoalsRoutes from './routes/SavingsGoalsRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// allow requests from any origin using CORS
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Use the expenses routes
app.use('/expenses', expenseRoutes); // Prefix the expenses routes

// use wishlist and notes routes
app.use('/wishlist', wishlistRoutes);
app.use('/notes', notesRoutes);

app.use(cors())

// Example root route
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running!');
});

// use tips routes
app.use('/tips', tipsRoutes);

// initialize the database
(async () => {
  await customTipsModel.init(true); 
})();


// use custom tips routes
app.use('/custom-tips', customTipsRoutes);

// use the savings goals routes
app.use('/savings-goals', savingsGoalsRoutes);

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));


// Start the server after initializing the database
const startServer = async () => {
  try {
    // Initialize the database
    await expenseModel.init(false); // Set to 'true' for testing; 'false' in production

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();
