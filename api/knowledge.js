const express = require('express');
const { FAQ, LibraryInfo } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ----------------- FAQS -----------------

// @route   GET /api/knowledge/faqs
// @desc    Get all FAQs
router.get('/faqs', async (req, res) => {
    try {
        const faqs = await FAQ.find().sort({ createdAt: -1 });
        res.json(faqs);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/knowledge/faqs
// @desc    Create a new FAQ
router.post('/faqs', authMiddleware, async (req, res) => {
    try {
        const { question, answer, category, status } = req.body;
        const newFAQ = new FAQ({ question, answer, category, status });
        const savedFAQ = await newFAQ.save();
        res.status(201).json(savedFAQ);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/knowledge/faqs/:id
// @desc    Update a FAQ
router.put('/faqs/:id', authMiddleware, async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(faq);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/knowledge/faqs/:id
// @desc    Delete a FAQ
router.delete('/faqs/:id', authMiddleware, async (req, res) => {
    try {
        await FAQ.findByIdAndDelete(req.params.id);
        res.json({ message: 'FAQ deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


// ----------------- LIBRARY INFO -----------------

// @route   GET /api/knowledge/library-info
// @desc    Get all library info
router.get('/library-info', async (req, res) => {
    try {
        const info = await LibraryInfo.find().sort({ createdAt: -1 });
        res.json(info);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/knowledge/library-info
// @desc    Create new library info
router.post('/library-info', authMiddleware, async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const newInfo = new LibraryInfo({ title, content, category });
        const savedInfo = await newInfo.save();
        res.status(201).json(savedInfo);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/knowledge/library-info/:id
// @desc    Update library info
router.put('/library-info/:id', authMiddleware, async (req, res) => {
    try {
        const info = await LibraryInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(info);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/knowledge/library-info/:id
// @desc    Delete library info
router.delete('/library-info/:id', authMiddleware, async (req, res) => {
    try {
        await LibraryInfo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Library info deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ----------------- SEARCH -----------------

// @route   GET /api/knowledge/search
// @desc    Search both FAQs and LibraryInfo
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.json({ faqs: [], libraryInfo: [] });

        const regex = new RegExp(query, 'i'); // Case-insensitive regex

        // Search FAQs
        const faqs = await FAQ.find({
            $or: [{ question: regex }, { answer: regex }]
        });

        // Search Library Info
        const libraryInfo = await LibraryInfo.find({
            $or: [{ title: regex }, { content: regex }]
        });

        res.json({ faqs, libraryInfo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
