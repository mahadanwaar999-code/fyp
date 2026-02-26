const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  qNumber: { type: Number },
  text: { type: String },
  answer: { type: mongoose.Schema.Types.Mixed }, // Can be String or Array of Strings
  altAnswer: { type: String }, // For single word variants
  type: { 
    type: String, 
    enum: ['form-completion', 'gap-fill', 'multiple-choice', 'table-completion', 'matching', 'selection', 'note-completion', 'map-labelling'],
    required: true 
  },
  options: { type: Map, of: String }, // For multiple choice options A: "...", B: "..."
  row: String, // For table-completion
  col: String  // For table-completion
}, { _id: false });

const PartSchema = new mongoose.Schema({
  partNumber: { type: Number, required: true },
  title: { type: String },
  instructions: { type: String },
  audioUrl: { type: String }, // Derived field: /public/listening-media/{testNum}_audios/{partNum}.mp3
  
  // Handling different part structures dynamically
  questions: [QuestionSchema], // Standard list of questions
  
  // Some parts have nested sections (e.g. Test 2 Part 1)
  sections: [{
    type: { type: String }, // 'table-completion', 'note-completion'
    title: String,
    headers: [String],
    questions: [QuestionSchema]
  }],

  // Some parts have nested subsections (e.g. Test 3 Part 1)
  subSections: [{
    title: String,
    questions: [QuestionSchema]
  }],

  // Some parts are map labelling or complex mixed types (Test 2 Part 2)
  multipleChoice: [QuestionSchema],
  mapLabelling: {
    title: String,
    imageUrl: String,
    labels: [String],
    questions: [QuestionSchema]
  },
  
  // Some parts are multiple selection mixed with matching (Test 2 Part 3)
  multipleSelection: [{
      qNumbers: [Number],
      text: String,
      options: [String],
      answer: [String]
  }],

  // Test 3 Part 3 Note Completion
  noteCompletion: {
    questions: [QuestionSchema]
  },

  matching: {
      options: { type: Map, of: String },
      topicOptions: { type: Map, of: String },
      questions: [QuestionSchema]
  }

}, { _id: false });

const ListeningTestSchema = new mongoose.Schema({
  bookTitle: String,
  testNumber: { type: Number, required: true, unique: true },
  section: { type: String, default: 'Listening' },
  totalQuestions: { type: Number, default: 40 },
  parts: [PartSchema]
});

module.exports = mongoose.model('ListeningTest', ListeningTestSchema);
