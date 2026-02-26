const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
  userModel: { type: String, required: true, enum: ['Student', 'Teacher'] },
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['deposit', 'withdrawal', 'payment_deduction', 'payment_release', 'refund', 'escrow_hold'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'cancelled'], 
    default: 'completed' 
  },
  referenceId: { type: mongoose.Schema.Types.ObjectId }, // Reference to LectureRequest or other entity
  transactionId: { type: String, unique: true, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
