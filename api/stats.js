const express = require('express');
const { ChatLog, Unanswered, FAQ } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/stats
// @desc    Get dashboard statistics
router.get('/', authMiddleware, async (req, res) => {
    try {
        const totalConversations = await ChatLog.countDocuments();
        const unansweredCount = await Unanswered.countDocuments({ status: 'pending' });
        const totalFaqs = await FAQ.countDocuments();
        
        // Count questions that weren't answered
        const failedAnswers = await ChatLog.countDocuments({ wasAnswered: false });
        
        res.json({
            totalConversations,
            unansweredCount,
            totalFaqs,
            failedAnswers,
            successRate: totalConversations === 0 ? 0 : Math.round(((totalConversations - failedAnswers) / totalConversations) * 100)
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/stats/chat-logs
// @desc    Get recent chat logs
router.get('/chat-logs', authMiddleware, async (req, res) => {
    try {
        const logs = await ChatLog.find().sort({ createdAt: -1 }).limit(50);
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
