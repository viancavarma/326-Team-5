import express from 'express';
import { Sequelize } from 'sequelize';
import expenseModel from '../models/SQLiteExpenseModel.js';
import { Expense } from '../models/SQLiteExpenseModel.js';

const router = express.Router();

// GET /expenses/summary
router.get('/summary', async (req, res) => {
    try {
        // Aggregate the expenses to get monthly totals
        const expenses = await Expense.findAll({
            attributes: [
                [Sequelize.fn('strftime', '%Y-%m', Sequelize.col('date')), 'month'],
                [Sequelize.fn('sum', Sequelize.col('amount')), 'total']
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
        const newExpense = await Expense.create({ date, label, amount, category });
        res.status(201).json(newExpense);
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /expenses - Retrieve all or filtered expenses
router.get('/', async (req, res) => {
    try {
        const { date, label, amount, category } = req.query;

        // Prepare filters based on query parameters
        const filters = {};
        if (date) filters.date = date;
        if (label) filters.label = { [Sequelize.Op.like]: `%${label}%` }; // Partial match for label
        if (amount) filters.amount = parseFloat(amount);
        if (category) filters.category = category;

        // Retrieve expenses from the model
        const expenses = await expenseModel.readAll(filters);

        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error retrieving expenses:', error);
        res.status(500).json({ error: 'Failed to retrieve expenses' });
    }
});

// GET /expenses/by-date/:date for bar graph
router.get('/by-date/:date', async (req, res) => {
    const { date } = req.params;

    try {
        // Filter for a specific date
        const filters = {
            date: Sequelize.where(Sequelize.fn('date', Sequelize.col('date')), date)
        };
        const expenses = await expenseModel.readAll(filters);

        if (expenses.length === 0) {
            return res.status(404).json({ message: 'No logs found for the selected date.' });
        }

        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error retrieving logs by date:', error.message, error.stack); // Log detailed error
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /expenses/by-month/:month for pie chart
router.get('/by-month/:month', async (req, res) => {
    const { month } = req.params; // Extract the month in YYYY-MM format

    try {
        // Parse the input month and derive the start and end dates
        const [year, monthPart] = month.split('-');
        const startDate = new Date(`${year}-${monthPart}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);
        endDate.setDate(0);

        // Query the database for expenses within the month and aggregate by category
        const expenses = await Expense.findAll({
            attributes: [
                'category',
                [Sequelize.fn('sum', Sequelize.col('amount')), 'total']
            ],
            where: {
                date: {
                    [Sequelize.Op.between]: [
                        startDate.toISOString().split('T')[0],
                        endDate.toISOString().split('T')[0]
                    ]
                }
            },
            group: ['category']
        });
        
        // Format the results as { category, total }
        const categoryData = expenses.map(expense => ({
            category: expense.get('category'),
            total: parseFloat(expense.get('total'))
        }));

        res.status(200).json(categoryData);
    } catch (error) {
        console.error('Error retrieving expenses by month:', error);
        res.status(500).json({ error: 'Failed to retrieve monthly data' });
    }
});



export default router;
