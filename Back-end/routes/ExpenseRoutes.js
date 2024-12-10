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

const passport = require("../auth/passport.js");
const { register, login, logout, googleAuthCallback, getProfile } = require("../controllers/UsersController.js");
const { isAuthenticated } = require("../auth/middleware.js");

// Routes for registration and login
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Google Authentication routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleAuthCallback
);

router.get("/profile", isAuthenticated, getProfile);

module.exports = router;
