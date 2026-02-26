const mongoose = require('mongoose');
const ListeningTest = require('./models/ListeningTest');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ielts_listening', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
    const tests = await ListeningTest.find({});
    let warnings = 0;
    tests.forEach(test => {
        test.parts.forEach(part => {
             // Recursive checker
             const check = (qs, path) => {
                 if (!qs) return;
                 qs.forEach(q => {
                     if (!q.type) {
                         console.log(`Missing TYPE in Test ${test.testNumber} Part ${part.partNumber}:`, JSON.stringify(q));
                         warnings++;
                     }
                 });
             };

             check(part.questions, 'questions');
             if(part.sections) part.sections.forEach(s => check(s.questions, 'sections'));
             if(part.multipleChoice) check(part.multipleChoice, 'multipleChoice');
             if(part.mapLabelling) check(part.mapLabelling.questions, 'mapLabelling');
             if(part.matching) check(part.matching.questions, 'matching');
             if(part.multipleSelection) check(part.multipleSelection, 'multipleSelection'); // MultipleSelection is array of questions? No, array of objects with qNumbers.
             
             // Wait, multipleSelection structure in schema:
             /*
             multipleSelection: [{
                qNumbers: [Number],
                text: String,
                options: [String],
                answer: [String]
             }]
             */
             // It doesn't use QuestionSchema because it has qNumbers (plural)
             // But my import script injected type=selection into it.
             // But QuestionSchema is NOT used for multipleSelection? 
             // Let's check schema definition.
        });
    });
    console.log(`Scan complete. ${warnings} warnings.`);
    process.exit(0);
});
