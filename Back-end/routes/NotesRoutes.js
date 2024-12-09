import express from 'express';
import { Sequelize } from 'sequelize';
import { Notes } from '../models/SQLiteNotesModel.js';

const router = express.Router();

// get notes
router.get('/', async (req, res) => {
    try {
        const notes = await Notes.findAll();
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error retrieving notes:', error);
        res.status(500).json({ error: 'Failed to retrieve notes' });
    }
});

//add note
router.post('/', async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const newNote = await Notes.create({ title, content });
        res.status(201).json(newNote);
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//update note
router.put('/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const id = req.params.id;

        if (!title || !content) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const updatedNote = await Notes.update({ title, content }, { where: { id } });
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedNote = await Notes.destroy({ where: { id } });
        res.status(200).json(deletedNote);
    }
    catch(error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;