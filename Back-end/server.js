import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON
app.use(express.json());

// Example route (replace later)
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});