const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const WritingTest = require('../models/WritingTest');

const WRITING_FOLDER = path.join(__dirname, '../../Writing');

async function seedWritingData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ielts_listening');
    console.log('Connected to MongoDB for seeding writing data...');

    // Clear existing writing data? Only if needed.
    // await WritingTest.deleteMany({});
    // console.log('Cleared existing Writing tests.');

    const files = fs.readdirSync(WRITING_FOLDER).filter(file => file.endsWith('.txt'));

    for (const file of files) {
      const filePath = path.join(WRITING_FOLDER, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      
      try {
        const testData = JSON.parse(fileContent);
        
        // Ensure testNumber is parsed correctly from filename if not in JSON
        if (!testData.testNumber) {
          testData.testNumber = parseInt(file.split('.')[0]);
        }

        // Normalize Tasks
        testData.tasks = testData.tasks.map(task => {
          // Task 1 Visual Data Normalization
          if (task.taskNumber === 1) {
            const visualData = task.chartData || task.chartMetadata || task.diagramMetadata || task.visualData;
            if (visualData) {
              task.chartData = visualData;
            }
          }
          
          // Task 2 Specific Questions Normalization
          if (task.taskNumber === 2) {
            if (task.specificQuestion && !task.specificQuestions) {
              task.specificQuestions = [task.specificQuestion];
            } else if (typeof task.specificQuestions === 'string') {
              task.specificQuestions = [task.specificQuestions];
            }
          }
          
          return task;
        });

        await WritingTest.findOneAndUpdate(
          { testNumber: testData.testNumber },
          testData,
          { upsert: true, new: true }
        );
        console.log(`Successfully seeded Writing Test ${testData.testNumber}`);
      } catch (parseError) {
        console.error(`Error parsing file ${file}:`, parseError.message);
      }
    }

    console.log('Writing data seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedWritingData();
