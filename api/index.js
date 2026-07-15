const express = require('express');
const cors = require('cors');
const { connectDB } = require('../database');

const chatHandler = require('../routes/chat');
const authRoutes = require('../routes/auth');
const knowledgeRoutes = require('../routes/knowledge');
const statsRoutes = require('../routes/stats');
const unansweredRoutes = require('../routes/unanswered');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/chat', chatHandler);
app.use('/api/auth', authRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/unanswered', unansweredRoutes);

module.exports = app;
