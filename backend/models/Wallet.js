const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true, unique: true },
  userModel: { type: String, required: true, enum: ['Student', 'Teacher'] },
  balance: { type: Number, default: 0.0 },
  escrowBalance: { type: Number, default: 0.0 },
  currency: { type: String, default: 'PKR' },
  bankAccounts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BankAccount' }],
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Wallet', WalletSchema);
