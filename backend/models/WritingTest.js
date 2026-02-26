const mongoose = require('mongoose');

const WritingTaskSchema = new mongoose.Schema({
  taskNumber: { type: Number, required: true },
  type: { type: String, required: true },
  timeSuggested: { type: String, required: true },
  wordLimit: { type: String, required: true },
  instructions: { type: String, required: true },
  prompt: { type: String, required: true },
  chartData: { type: mongoose.Schema.Types.Mixed },
  specificQuestions: [String]
}, { _id: false });

const WritingTestSchema = new mongoose.Schema({
  bookTitle: { type: String, required: true },
  testNumber: { type: Number, required: true, unique: true },
  section: { type: String, default: 'Writing' },
  tasks: [WritingTaskSchema]
}, { timestamps: true });

module.exports = mongoose.model('WritingTest', WritingTestSchema);
