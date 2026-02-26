const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'LectureSession', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  senderRole: { type: String, enum: ['Student', 'Teacher'], required: true },
  messageType: { type: String, enum: ['text', 'file'], default: 'text' },
  content: { type: String },
  fileUrl: { type: String },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
