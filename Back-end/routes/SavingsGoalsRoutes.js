import express from 'express';
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

export default router;