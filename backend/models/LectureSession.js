const mongoose = require('mongoose');

const LectureSessionSchema = new mongoose.Schema({
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'LectureRequest', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  status: { 
    type: String, 
    enum: ['scheduled', 'live', 'completed', 'review_pending', 'dispute_review', 'closed'], 
    default: 'scheduled' 
  },
  recordingUrl: { type: String },
  recordingStatus: { 
    type: String, 
    enum: ['none', 'temporary', 'saved', 'deleted'], 
    default: 'none' 
  }
}, { timestamps: true });

module.exports = mongoose.model('LectureSession', LectureSessionSchema);
