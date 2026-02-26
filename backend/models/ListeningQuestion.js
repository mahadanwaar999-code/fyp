const mongoose = require('mongoose');

const listeningQuestionSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Unique ID for frontend tracking
    section: { type: Number, required: true }, // 1, 2, 3, or 4
    type: { 
        type: String, 
        required: true,
        enum: ['note-completion', 'multiple-choice', 'table-completion', 'matching', 'standard-multiple-choice', 'multiple-response', 'short-answer', 'fill-blank'] 
    },
    questionText: {
        en: { type: String, required: true },
        zh: { type: String }
    },
    // For multiple choice
    options: [{ type: String }],
    
    // For matching
    matchingLeft: [{ type: String }],
    matchingRight: [{ type: String }],
    
    // For table/flow chart: structure definition
    metadata: { type: mongoose.Schema.Types.Mixed }, 

    correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true }, // String or Object (for matching)
    
    audioSrc: { type: String } // Optional override if specific question has audio, normally per section
});

module.exports = mongoose.model('ListeningQuestion', listeningQuestionSchema);
