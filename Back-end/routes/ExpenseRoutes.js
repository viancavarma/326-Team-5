import express from 'express';

const router = express.Router();

// Mock database for testing
const mockDatabase = [
    { category: 'Food', amount: 40 },
    { category: 'Food', amount: 30 },
    { category: 'Personal', amount: 20 },
    { category: 'Personal', amount: 10 },
];

router.get('/most-expensive-category', (req, res) => {
    try {
        const categoryTotals = mockDatabase.reduce((totals, expense) => {
            if (!totals[expense.category]) {
                totals[expense.category] = 0;
            }
            totals[expense.category] += expense.amount;
            return totals;
        }, {});

        const mostExpensiveCategory = Object.entries(categoryTotals).reduce(
            (max, [category, total]) =>
                total > max.total ? { category, total } : max,
            { category: null, total: 0 }
        );

        if (mostExpensiveCategory.category) {
            res.status(200).json(mostExpensiveCategory);
        } else {
            res.status(404).json({ error: 'No data found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;