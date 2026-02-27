const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    const { name, email, phone, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User  already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'User  registered successfully.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Check if JWT_SECRET is defined
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined');
            return res.status(500).json({ message: 'Server configuration error.' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

module.exports = router;
