import express from 'express';
import dotenv from 'dotenv';
import expenseRoutes from './routes/ExpenseRoutes.js';
import expenseModel from './models/SQLiteExpenseModel.js';
import wishlistRoutes from './routes/WishlistRoutes.js';
import notesRoutes from './routes/NotesRoutes.js';
import tipsRoutes from './routes/tipsRoutes.js';
import sequelize from './config/database.js';
import customTipsModel from './models/SQLiteTipsModel.js';
import customTipsRoutes from './routes/CustomTipsRoutes.js';
import savingsGoalsRoutes from './routes/SavingsGoalsRoutes.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// allow requests from any origin using CORS
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Use the expenses routes
app.use('/expenses', expenseRoutes); // Prefix the expenses routes

// use wishlist and notes routes
app.use('/wishlist', wishlistRoutes);
app.use('/notes', notesRoutes);

app.use(cors())

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Serves static files to get our html, css, js etc from the Front-end directory
app.use(express.static(path.join(__dirname, '..', 'Front-end')));

// Serve the HTML file at the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Front-end', 'index.html'));
});

// use tips routes
app.use('/tips', tipsRoutes);

// initialize the database
(async () => {
  await customTipsModel.init(true); 
})();


// use custom tips routes
app.use('/custom-tips', customTipsRoutes);

// use the savings goals routes
app.use('/savings-goals', savingsGoalsRoutes);

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));


// Start the server after initializing the database
const startServer = async () => {
  try {
    // Initialize the database
    await expenseModel.init(false); // Set to 'true' for testing; 'false' in production

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

app.use(
  session({
    secret: process.env.SESSION_SECRET,  
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Google authentication route
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

// Google OAuth callback route
app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to profile page or wherever you'd like after successful login
    res.redirect('/');
  }
);

startServer();
