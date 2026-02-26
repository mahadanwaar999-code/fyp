const express = require('express');
const router = express.Router();
const ReadingTest = require('../models/ReadingTest');

// GET /api/reading/ - List all available tests (basic info)
router.get('/', async (req, res) => {
  try {
    const tests = await ReadingTest.find({}, 'bookTitle testNumber totalQuestions');
    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reading/random - Get a random reading test
router.get('/random', async (req, res) => {
  try {
    const count = await ReadingTest.countDocuments();
    if (count === 0) return res.status(404).json({ message: 'No reading tests found' });
    
    const randomIndex = Math.floor(Math.random() * count);
    const test = await ReadingTest.findOne().skip(randomIndex);
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reading/:testNumber - Get full test data by test number
router.get('/:testNumber', async (req, res) => {
  try {
    const test = await ReadingTest.findOne({ testNumber: req.params.testNumber });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reading/submit - Validate answers and score
router.post('/submit', async (req, res) => {
  const { testNumber, answers } = req.body; // answers: { "1": "answer1", "2": ["A", "B"] ... }
  
  try {
    const test = await ReadingTest.findOne({ testNumber });
    if (!test) return res.status(404).json({ message: 'Test not found' });

    let score = 0;
    const feedback = [];

    test.passages.forEach(passage => {
      passage.questionGroups.forEach(group => {
        group.questions.forEach(q => {
          const userAnswer = answers[q.qNumber.toString()];
          const correctAnswer = q.answer;
          const altAnswer = q.altAnswer;

          let isCorrect = false;

          if (Array.isArray(correctAnswer)) {
            // Multiple selection
            if (Array.isArray(userAnswer)) {
              // Compare arrays (order independent is better, but let's be simple for now)
              const sortedUser = [...userAnswer].sort();
              const sortedCorrect = [...correctAnswer].sort();
              isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
            }
          } else {
            // Single answer
            if (userAnswer && typeof userAnswer === 'string') {
                const normalizedUser = userAnswer.trim().toLowerCase();
                const normalizedCorrect = String(correctAnswer).trim().toLowerCase();
                const normalizedAlt = altAnswer ? String(altAnswer).trim().toLowerCase() : null;

                isCorrect = (normalizedUser === normalizedCorrect) || (normalizedAlt && normalizedUser === normalizedAlt);
            }
          }

          if (isCorrect) score++;

          feedback.push({
            qNumber: q.qNumber,
            userAnswer,
            correctAnswer,
            isCorrect
          });
        });
      });
    });

    res.json({
      score,
      totalQuestions: test.totalQuestions,
      feedback
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
