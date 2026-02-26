const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TeacherSchema = new mongoose.Schema({
  auth: {
    email: { type: String, unique: true, sparse: true, index: true },
    phoneNumber: { type: String, unique: true, sparse: true, index: true },
    password: { type: String, required: true }
  },
  logins: [
    {
      datetime: { type: Date, default: Date.now },
      location: {
        ip: String,
        city: String,
        country: String,
        device: String
      }
    }
  ],
  profile: {
    fullName: { type: String, required: true },
    photoUrl: { type: String },
    ieltsCertificate: { type: String },
    signupDate: { type: Date, default: Date.now }
  },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  kyc: { type: mongoose.Schema.Types.ObjectId, ref: 'KYC' },
  stats: {
    totalSessions: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Hash password before saving
TeacherSchema.pre('save', async function(next) {
  if (!this.isModified('auth.password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.auth.password = await bcrypt.hash(this.auth.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare password
TeacherSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.auth.password);
};

module.exports = mongoose.model('Teacher', TeacherSchema);
