const mongoose = require('mongoose');

const WritingSubmissionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'WritingTest', required: true },
  userEmail: { type: String }, // Optional, can be tied to user account in future
  testNumber: { type: Number, required: true },
  responses: [
    {
      taskNumber: { type: Number, required: true },
      essayContent: { type: String, required: true },
      wordCount: { type: Number, required: true },
      timeTaken: { type: Number } // In seconds
    }
  ],
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('WritingSubmission', WritingSubmissionSchema);
