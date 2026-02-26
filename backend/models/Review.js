const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'LectureSession', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  feedback: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
