import express from 'express';
import expenseModel from '../models/SQLiteExpenseModel.js';

const router = express.Router();

router.get('/most-expensive', async (req, res) => {
    try {
      const mostExpensive = await expenseModel.findMostExpensive();
      if (!mostExpensive) {
        return res.status(404).json({ message: 'No expenses found' });
      }
      res.json(mostExpensive);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default router