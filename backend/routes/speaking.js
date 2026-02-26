const express = require('express');
const router = express.Router();
const SpeakingTest = require('../models/SpeakingTest');

// Get a random speaking test
router.get('/random', async (req, res) => {
    try {
        const count = await SpeakingTest.countDocuments();
        if (count === 0) {
            return res.status(404).json({ message: 'No speaking tests found' });
        }
        const random = Math.floor(Math.random() * count);
        const test = await SpeakingTest.findOne().skip(random);
        res.json(test);
    } catch (err) {
        console.error('Error fetching random speaking test:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all speaking tests (for admin/debugging)
router.get('/', async (req, res) => {
    try {
        const tests = await SpeakingTest.find();
        res.json(tests);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
