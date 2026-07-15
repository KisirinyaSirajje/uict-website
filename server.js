require('dotenv').config();
const path = require('path');
const express = require('express');
const app = require('./api/index'); // Reuse the express app from the serverless entrypoint

const PORT = process.env.PORT || 3000;

// Serve static files from the project root
app.use(express.static(path.join(__dirname)));

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

module.exports = app;
