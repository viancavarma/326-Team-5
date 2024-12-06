import express from 'express';

// File: routes/expenses.js
const router = express.Router();

const mockDatabase = [
    { category: 'Food', amount: 40 },
    { category: 'Food', amount: 30 },
    { category: 'Food', amount: 10 },
    { category: 'Personal', amount: 20 },
    { category: 'Personal', amount: 5 },
];

// GET expenses/most-expenses-category
router.get('/most-expensive-category', (req, res) => {
    try {
        // Aggregate total amounts by category
        const categoryTotals = mockDatabase.reduce((totals, expense) => {
            if (!totals[expense.category]) {
                totals[expense.category] = 0;
            }
            totals[expense.category] += expense.amount;
            return totals;
        }, {});

        // Find the category with the highest total
        const mostExpensiveCategory = Object.entries(categoryTotals).reduce(
            (max, [category, total]) => (total > max.total ? { category, total } : max),
            { category: null, total: 0 }
        );

        if (mostExpensiveCategory.category) {
            res.status(200).json(mostExpensiveCategory);
        } else {
            res.status(404).json({ error: 'No expenses found' });
        }
    } catch (error) {
        console.error('Error retrieving most expensive category:', error);
        res.status(500).json({ error: 'Failed to retrieve data' });
    }
});

export default router;