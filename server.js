require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./database');

const chatHandler = require('./routes/chat');
const authRoutes = require('./routes/auth');
const knowledgeRoutes = require('./routes/knowledge');
const statsRoutes = require('./routes/stats');
const unansweredRoutes = require('./routes/unanswered');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the project root
app.use(express.static(path.join(__dirname)));

// API Routes
app.post('/api/chat', chatHandler);
app.use('/api/auth', authRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/unanswered', unansweredRoutes);

// Fallback: serve index.html for all other GET requests (for SPA support)
app.get('/{*path}', (req, res) => {
    // Exclude API routes from falling back to index.html
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    
    // Serve admin dashboard if path starts with /admin
    if (req.path.startsWith('/admin')) {
        return res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
    }
    
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server if not running in a serverless environment (Vercel sets VERCEL=1)
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`✅ UICT e-Library server running at http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless function
module.exports = app;
