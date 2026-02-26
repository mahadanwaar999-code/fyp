const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
  auth: {
    email: { type: String, unique: true, sparse: true, index: true },
    phoneNumber: { type: String, unique: true, sparse: true, index: true },
    password: { type: String, required: true }
  },
  profile: {
    fullName: { type: String, required: true },
    photoUrl: { type: String },
    signupDate: { type: Date, default: Date.now },
    location: {
      ip: String,
      city: String,
      country: String,
      device: String
    }
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
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' },
  kyc: { type: mongoose.Schema.Types.ObjectId, ref: 'KYC' },
  academicData: {
    testHistory: [
      {
        date: { type: Date, default: Date.now },
        marks: {
          R: { type: Number, default: null },
          W: { type: Number, default: null },
          S: { type: Number, default: null },
          L: { type: Number, default: null }
        },
        overall: { type: Number, default: 0 }
      }
    ],
    deficiencyMatrix: {
      grammarGap: { type: Number, default: 0 },
      vocabularyStrength: { type: Number, default: 0 },
      fluencyRisk: { type: Number, default: 0 },
      lastAnalyzed: { type: Date }
    }
  }
}, { timestamps: true });

// Hash password before saving
StudentSchema.pre('save', async function(next) {
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
StudentSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.auth.password);
};

module.exports = mongoose.model('Student', StudentSchema);
