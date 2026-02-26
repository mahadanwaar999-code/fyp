const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
  userModel: { type: String, required: true, enum: ['Student', 'Teacher'] },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true }, // Should be encrypted in a real app, keeping it plain for now or adding comment
  accountTitle: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('BankAccount', BankAccountSchema);
