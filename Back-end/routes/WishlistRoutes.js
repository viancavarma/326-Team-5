import express from 'express';
import { Sequelize } from 'sequelize';
import { Wishlist } from '../models/SQLiteWishlistModel.js';

const router = express.Router();

// get wishlist items
router.get('/', async (req, res) => {
    try {
        const wishlist = await Wishlist.findAll();
        res.status(200).json(wishlist);
    } catch (error) {
        console.error('Error retrieving wishlist items:', error);
        res.status(500).json({ error: 'Failed to retrieve wishlist items' });
    }
});

// add wishlist item
router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newWishlistItem = await Wishlist.create({ title, content });
        res.status(201).json(newWishlistItem);
    } catch (error) {
        console.error('Error adding wishlist item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// update wishlist item
router.put('/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const id = req.params.id;

        if (!title || !content) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const updatedWishlistItem = await Wishlist.update({ title, content }, { where: { id } });
        res.status(200).json(updatedWishlistItem);
    } catch (error) {
        console.error('Error updating wishlist item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// delete wishlist item 
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedWishlistItem = await Wishlist.destroy({ where: { id } });
        res.status(200).json(deletedWishlistItem);
    }
    catch(error) {
        console.error('Error deleting wishlist item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
