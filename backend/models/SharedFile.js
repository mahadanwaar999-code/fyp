const mongoose = require('mongoose');

const SharedFileSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'LectureSession', required: true },
  uploaderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  uploaderRole: { type: String, enum: ['Student', 'Teacher'], required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileSize: { type: Number, required: true }, // in bytes
  fileUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('SharedFile', SharedFileSchema);
