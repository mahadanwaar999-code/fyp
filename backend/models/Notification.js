const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
  userModel: { type: String, required: true, enum: ['Student', 'Teacher'] },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: [
      'request_sent', 
      'request_accepted', 
      'request_rejected', 
      'teacher_assigned', 
      'payment_deducted', 
      'payment_released', 
      'lecture_completed', 
      'refund_issued',
      'lecture_started',
      'lecture_ended',
      'review_required',
      'recording_deleted',
      'recording_saved_for_review',
      'system'
    ], 
    default: 'system' 
  },
  isRead: { type: Boolean, default: false },
  metadata: { type: Object }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
