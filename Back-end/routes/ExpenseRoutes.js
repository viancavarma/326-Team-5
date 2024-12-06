// File: routes/expenses.js

const express = require('express');
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

// GET expenses/most-expenses-category
router.get('/most-expensive-category', async (req, res) => {
    try {
        // Aggregate total amount by category
        const categoryTotals = await Expense.findAll({
            attributes: [
                'category',
                [sequelize.fn('sum', sequelize.col('amount')), 'total']
            ],
            group: ['category'],
            order: [[sequelize.fn('sum', sequelize.col('amount')), 'DESC']],
            limit: 1 // Only get the category with the highest total
        });

        if (categoryTotals.length > 0) {
            const mostExpensiveCategory = categoryTotals[0].get();
            res.status(200).json(mostExpensiveCategory);
        } else {
            res.status(404).json({ error: 'No expenses found' });
        }
    } catch (error) {
        console.error('Error retrieving most expensive category:', error);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

module.exports = router;
