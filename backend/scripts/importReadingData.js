const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const ReadingTest = require('../models/ReadingTest');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const READING_DIR = path.join(__dirname, '../../Reading');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ielts_listening', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB connected for Reading import');
  await importData();
})
.catch(err => console.error(err));

async function importData() {
  try {
    // Clear existing data
    await ReadingTest.deleteMany({});
    console.log('Cleared existing Reading Tests');

    const files = fs.readdirSync(READING_DIR);
    const txtFiles = files.filter(f => f.endsWith('.txt'));

    for (const file of txtFiles) {
        const testNum = file.replace('.txt', '');
        console.log(`Processing Reading Test ${testNum}...`);

        const filePath = path.join(READING_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        let testData;
        
        try {
            testData = JSON.parse(content);
        } catch (e) {
            console.error(`Error parsing JSON in ${file}:`, e.message);
            continue;
        }

        // Ensure defaults
        if (!testData.section) testData.section = 'Reading';
        if (!testData.timeLimit) testData.timeLimit = 60;
        if (!testData.totalQuestions) testData.totalQuestions = 40;

        const newTest = new ReadingTest(testData);
        await newTest.save();
        console.log(`  Saved Reading Test ${testNum} to DB`);
    }

    console.log('Reading data import complete.');
    process.exit(0);

  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Error Details:', JSON.stringify(error.errors, null, 2));
    }
    console.error('Reading import failed:', error);
    process.exit(1);
  }
}
