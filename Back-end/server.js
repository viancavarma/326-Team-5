import express from 'express';
import dotenv from 'dotenv';
import expenseRoutes from './routes/ExpenseRoutes.js'; // Import the expenses routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Use the expenses routes
app.use('/expenses', expenseRoutes); // Prefix the expenses routes

// Example root route
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
