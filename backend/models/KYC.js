const mongoose = require('mongoose');

const KYCSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true, unique: true },
  userModel: { type: String, required: true, enum: ['Student', 'Teacher'] },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  documentType: { type: String, required: true },
  documentUrl: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date },
  adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('KYC', KYCSchema);
