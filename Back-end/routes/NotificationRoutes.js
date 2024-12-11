// Import necessary modules
import express from 'express';
import notificationsModel from '../models/SQLiteNotificationsModel.js';

const router = express.Router();

// Route to create a new notification
router.post('/', async (req, res) => {
    const { userId, message } = req.body; 
    try {
        const notification = await notificationsModel.create({ userId, message }); 
        res.status(201).json(notification); 
    } catch (error) {
        res.status(500).json({ error: 'Failed to create notification.' }); 
    }
});