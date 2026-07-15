const express = require('express');
const { Unanswered } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/unanswered
// @desc    Get all unanswered questions
router.get('/', authMiddleware, async (req, res) => {
    try {
        const questions = await Unanswered.find().sort({ createdAt: -1 });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/unanswered/:id
// @desc    Update status of an unanswered question
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const question = await Unanswered.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(question);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/unanswered/:id
// @desc    Delete an unanswered question
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Unanswered.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
