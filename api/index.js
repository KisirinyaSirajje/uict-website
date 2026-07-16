const express = require('express');
const cors = require('cors');
const { connectDB } = require('../database');

const chatHandler = require('../routes/chat');
const authRoutes = require('../routes/auth');
const knowledgeRoutes = require('../routes/knowledge');
const statsRoutes = require('../routes/stats');
const unansweredRoutes = require('../routes/unanswered');

const app = express();

app.use(cors());
app.use(express.json());

// Middleware: ensure MongoDB is connected before handling any API request
// This is critical for Vercel serverless where each cold start needs to await the connection
app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        res.status(500).json({ error: 'Database connection failed. Please try again.' });
    }
});

// API Routes
app.post('/api/chat', chatHandler);
app.use('/api/auth', authRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/unanswered', unansweredRoutes);

module.exports = app;

