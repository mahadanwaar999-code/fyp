const express = require('express');
const router = express.Router();
const WritingTest = require('../models/WritingTest');
const WritingSubmission = require('../models/WritingSubmission');

// GET /api/writing/random
router.get('/random', async (req, res) => {
  try {
    const count = await WritingTest.countDocuments();
    if (count === 0) {
      return res.status(404).json({ message: 'No writing tests found' });
    }
    const random = Math.floor(Math.random() * count);
    const test = await WritingTest.findOne().skip(random);
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/writing/:testNumber
router.get('/:testNumber', async (req, res) => {
  try {
    const test = await WritingTest.findOne({ testNumber: req.params.testNumber });
    if (!test) {
      return res.status(404).json({ message: 'Writing test not found' });
    }
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/writing/submit
router.post('/submit', async (req, res) => {
  try {
    const { testId, testNumber, responses, userEmail } = req.body;
    
    if (!testId || !responses) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const submission = new WritingSubmission({
      testId,
      testNumber,
      responses,
      userEmail
    });

    const savedSubmission = await submission.save();
    res.status(201).json({ 
      message: 'Submission saved successfully', 
      submissionId: savedSubmission._id 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
