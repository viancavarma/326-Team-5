import express from 'express';
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

// GET /savings-goals/:id - Retrieve a specific savings goal by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const goal = await savingsGoalsModel.readById(id);

        if (!goal) {
            return res.status(404).json({ error: 'Savings goal not found.' });
        }

        res.status(200).json(goal);
    } catch (error) {
        console.error('Error retrieving savings goal:', error);
        res.status(500).json({ error: 'Failed to retrieve savings goal.' });
    }
});

// PUT /savings-goals/:id - Update an existing savings goal by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { goal_name, target_amount, current_amount, deadline } = req.body;

    try {
        const goal = await savingsGoalsModel.readById(id);

        if (!goal) {
            return res.status(404).json({ error: 'Savings goal not found.' });
        }

        // Validate input
        if (target_amount && target_amount <= 0) {
            return res.status(400).json({ error: 'Target amount must be a positive number.' });
        }
        if (current_amount && current_amount < 0) {
            return res.status(400).json({ error: 'Current amount cannot be negative.' });
        }
        if (deadline && new Date(deadline) <= new Date()) {
            return res.status(400).json({ error: 'Deadline must be a future date.' });
        }

        const updatedGoal = await savingsGoalsModel.update(id, {
            goal_name: goal_name || goal.goal_name,
            target_amount: target_amount || goal.target_amount,
            current_amount: current_amount || goal.current_amount,
            deadline: deadline || goal.deadline,
        });

        res.status(200).json(updatedGoal);
    } catch (error) {
        console.error('Error updating savings goal:', error);
        res.status(500).json({ error: 'Failed to update savings goal.' });
    }
});

// DELETE /savings-goals/:id - Delete a savings goal by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const goal = await savingsGoalsModel.readById(id);

        if (!goal) {
            return res.status(404).json({ error: 'Savings goal not found.' });
        }

        await savingsGoalsModel.delete(id);
        res.status(200).json({ message: 'Savings goal deleted successfully.' });
    } catch (error) {
        console.error('Error deleting savings goal:', error);
        res.status(500).json({ error: 'Failed to delete savings goal.' });
    }
});

export default router;