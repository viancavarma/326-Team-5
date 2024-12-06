import express from 'express';
import expenseModel from '../models/SQLiteExpenseModel.js';

const router = express.Router();
const { Expense } = require('../models');
const { sequelize } = require('../models');

// GET /expenses/summary
router.get('/summary', async (req, res) => {
    try {
        // Aggregate the expenses to get monthly totals
        const expenses = await Expense.findAll({
            attributes: [
                [sequelize.fn('strftime', '%Y-%m', sequelize.col('date')), 'month'],
                [sequelize.fn('sum', sequelize.col('amount')), 'total']
            ],
            group: ['month'],
            order: [['month', 'ASC']]
        });

        // Map the results to an array of { month, total } objects
        const summaryData = expenses.map(expense => ({
            month: expense.get('month'),
            total: parseFloat(expense.get('total'))
        }));

        res.status(200).json(summaryData);
    } catch (error) {
        console.error('Error retrieving monthly summary:', error);
        res.status(500).json({ error: 'Failed to retrieve summary data' });
    }
});

// POST /expenses/add a new expense
router.post('/', async (req, res) => {
    try {
        const { date, label, amount, category } = req.body;

        // Validate input
        if (!date || !label || !amount || !category) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create the expense
        const newExpense = await expenseModel.create({ date, label, amount, category });
        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
