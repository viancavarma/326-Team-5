import express from 'express';
import { Sequelize } from 'sequelize';
import savingsGoalsModel from '../models/SQLiteSavingsGoalsModel.js';
import { SavingsGoal } from '../models/SQLiteSavingsGoalsModel.js';

const router = express.Router();

// POST /savings-goals - Add a new savings goal
router.post('/', async (req, res) => {
    try {
        const { user_id, goal_name, target_amount, current_amount, deadline } = req.body;

        // Validate input
        if (!user_id || !goal_name || !target_amount || !deadline) {
            return res.status(400).json({ error: 'All fields except current_amount are required.' });
        }

        if (target_amount <= 0 || (current_amount && current_amount < 0)) {
            return res.status(400).json({ error: 'Amounts must be positive numbers.' });
        }

        if (new Date(deadline) <= new Date()) {
            return res.status(400).json({ error: 'Deadline must be a future date.' });
        }

        // Create the savings goal
        const newGoal = await SavingsGoal.create({
            user_id,
            goal_name,
            target_amount,
            current_amount: current_amount || 0,
            deadline,
        });

        res.status(201).json(newGoal);
    } catch (error) {
        console.error('Error adding savings goal:', error);
        res.status(500).json({ error: 'Failed to add savings goal.' });
    }
});

// GET /savings-goals - Retrieve all savings goals
router.get('/', async (req, res) => {
    try {
        const goals = await savingsGoalsModel.readAll();
        res.status(200).json(goals);
    } catch (error) {
        console.error('Error retrieving savings goals:', error);
        res.status(500).json({ error: 'Failed to retrieve savings goals.' });
    }
});

// GET /savings-goals/summary - Retrieve total progress towards goals
router.get('/summary', async (req, res) => {
    try {
        const goals = await SavingsGoal.findAll({
            attributes: [
                [Sequelize.fn('sum', Sequelize.col('current_amount')), 'total_current'],
                [Sequelize.fn('sum', Sequelize.col('target_amount')), 'total_target']
            ],
        });

        const summary = {
            total_current: parseFloat(goals[0].get('total_current')) || 0,
            total_target: parseFloat(goals[0].get('total_target')) || 0,
        };

        res.status(200).json(summary);
    } catch (error) {
        console.error('Error retrieving summary:', error);
        res.status(500).json({ error: 'Failed to retrieve savings goals summary.' });
    }
});

// GET /savings-goals/:id - Retrieve a single savings goal by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const goal = await SavingsGoal.findByPk(id);

        if (!goal) {
            return res.status(404).json({ error: 'Savings goal not found.' });
        }

        res.status(200).json(goal);
    } catch (error) {
        console.error('Error retrieving savings goal:', error);
        res.status(500).json({ error: 'Failed to retrieve savings goal.' });
    }
});

export default router;