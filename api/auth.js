const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new admin/librarian (Protected - ideally only admins can create others, but open for initial setup)
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        user = new User({
            username,
            password,
            role: role || 'librarian'
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user details
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
