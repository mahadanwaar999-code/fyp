const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const SpeakingTest = require('../models/SpeakingTest');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ielts_listening';
const SPEAKING_DIR = path.join(__dirname, '../../Speaking');

async function importSpeakingTests() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing speaking data
        await SpeakingTest.deleteMany({});
        console.log('Cleared existing speaking tests');

        const files = fs.readdirSync(SPEAKING_DIR);
        const txtFiles = files.filter(f => f.endsWith('.txt'));

        for (const file of txtFiles) {
            const filePath = path.join(SPEAKING_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            try {
                const data = JSON.parse(content);
                const speakingTest = new SpeakingTest(data);
                await speakingTest.save();
                console.log(`Imported: ${file}`);
            } catch (err) {
                console.error(`Error parsing or saving ${file}:`, err.message);
            }
        }

        console.log('Speaking tests imported successfully');
        process.exit(0);
    } catch (err) {
        console.error('Import error:', err);
        process.exit(1);
    }
}

importSpeakingTests();
