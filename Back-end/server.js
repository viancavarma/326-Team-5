import express from 'express';
import dotenv from 'dotenv';
import expenseRoutes from './routes/ExpenseRoutes.js';
import expenseModel from './models/SQLiteExpenseModel.js';
import wishlistRoutes from './routes/WishlistRoutes.js';
import notesRoutes from './routes/NotesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Use the expenses routes
app.use('/expenses', expenseRoutes); // Prefix the expenses routes

// use wishlist and notes routes
app.use('/wishlist', wishlistRoutes);
app.use('/notes', notesRoutes);

// Example root route
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running!');
});

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
