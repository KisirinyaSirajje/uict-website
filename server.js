require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const chatHandler = require('./api/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the project root
app.use(express.static(path.join(__dirname)));

// API Routes
app.post('/api/chat', chatHandler);

// Fallback: serve index.html for all other GET requests
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ UICT e-Library server running at http://localhost:${PORT}`);
});
