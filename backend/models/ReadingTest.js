const mongoose = require('mongoose');

const ReadingQuestionSchema = new mongoose.Schema({
  qNumber: { type: Number, required: true },
  text: { type: String },
  answer: { type: mongoose.Schema.Types.Mixed }, // String or Array of Strings
  altAnswer: { type: String },
  options: { type: mongoose.Schema.Types.Mixed } // Can be Object {A: "..."}, or Array ["..."]
}, { _id: false });

const ReadingQuestionGroupSchema = new mongoose.Schema({
  instructions: { type: String },
  type: { 
    type: String, 
    required: true 
  },
  questions: [ReadingQuestionSchema],
  options: { type: mongoose.Schema.Types.Mixed }, // Optional group-level options (e.g. for multiple selection)
  qNumbers: [Number] // Optional group-level question numbers
}, { _id: false });

const ReadingPassageSchema = new mongoose.Schema({
  passageNumber: { type: Number, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  questionGroups: [ReadingQuestionGroupSchema]
}, { _id: false });

const ReadingTestSchema = new mongoose.Schema({
  bookTitle: { type: String },
  testNumber: { type: Number, required: true, unique: true },
  section: { type: String, default: 'Reading' },
  timeLimit: { type: Number, default: 60 },
  totalQuestions: { type: Number, default: 40 },
  passages: [ReadingPassageSchema]
}, { timestamps: true });

module.exports = mongoose.model('ReadingTest', ReadingTestSchema);
