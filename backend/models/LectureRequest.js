const mongoose = require('mongoose');

const LectureRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  subject: { type: String },
  scheduledTime: { type: Date },
  requestedDate: { type: Date, default: Date.now },
  duration: { type: Number }, // in minutes
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  weakAreas: { type: String },
  message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('LectureRequest', LectureRequestSchema);
