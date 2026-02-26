const express = require('express');
const router = express.Router();
const ListeningTest = require('../models/ListeningTest');

// GET /api/listening/ - List all available tests (basic info)
router.get('/', async (req, res) => {
  try {
    const tests = await ListeningTest.find({}, 'bookTitle testNumber totalQuestions');
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/listening/:testNumber - Get full test data
router.get('/:testNumber', async (req, res) => {
  try {
    const test = await ListeningTest.findOne({ testNumber: req.params.testNumber });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
