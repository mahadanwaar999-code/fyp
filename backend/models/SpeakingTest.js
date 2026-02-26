const mongoose = require('mongoose');

const SpeakingTestSchema = new mongoose.Schema({
    bookTitle: { type: String, required: true },
    testNumber: { type: Number, required: true },
    section: { type: String, default: 'Speaking' },
    parts: [
        {
            partNumber: { type: Number, required: true },
            title: { type: String, required: true },
            description: { type: String },
            mainTopic: { type: String },
            questions: [String], // Part 1
            instructions: { type: String }, // Part 2
            cueCard: { // Part 2
                prompt: { type: String },
                bulletPoints: [String],
                conclusionPoint: { type: String },
                timers: {
                    preparationSeconds: { type: Number, default: 60 },
                    speakingSeconds: { type: Number, default: 120 }
                }
            },
            discussionTopics: [ // Part 3
                {
                    subTopic: { type: String },
                    questions: [String]
                }
            ]
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SpeakingTest', SpeakingTestSchema);
