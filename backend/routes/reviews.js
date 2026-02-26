const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Review = require('../models/Review');
const LectureSession = require('../models/LectureSession');
const Notification = require('../models/Notification');
const authenticate = require('../middleware/auth');

// Submit Review & Handle Recording Logic
router.post('/:sessionId', authenticate, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    const { sessionId } = req.params;

    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit reviews' });
    }

    const session = await LectureSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.studentId.toString() !== req.user.id) {
       return res.status(403).json({ message: 'Unauthorized review submission' });
    }

    // Process Review
    const newReview = new Review({
      sessionId: session._id,
      studentId: session.studentId,
      teacherId: session.teacherId,
      rating: rating,
      feedback: feedback
    });
    await newReview.save();

    // Conditional Media Recording Storage Logic
    if (rating >= 4) {
      // Good rating, lecture satisfactory -> delete recording and close session
      session.status = 'closed';
      
      if (session.recordingUrl && session.recordingStatus === 'temporary') {
        const filePath = path.join(__dirname, '..', session.recordingUrl);
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting recording file:', err.message);
        });
        session.recordingUrl = null;
        session.recordingStatus = 'deleted';

        // Notify Teacher
        const notif = new Notification({
           userId: session.teacherId,
           userModel: 'Teacher',
           title: 'Recording Deleted',
           message: `Lecture accepted with good rating. Recording for session ${sessionId} permanently deleted.`,
           type: 'recording_deleted'
        });
        await notif.save();
      }
    } else {
      // Poor rating, student indicates issue -> save recording for Admin Review
      session.status = 'dispute_review';
      if (session.recordingUrl && session.recordingStatus === 'temporary') {
         session.recordingStatus = 'saved';

         // Notify Admin/Teacher
         const notif = new Notification({
           userId: session.teacherId,
           userModel: 'Teacher',
           title: 'Session In Dispute',
           message: `Lecture received a low rating. Recording saved for review.`,
           type: 'recording_saved_for_review'
         });
         await notif.save();
      }
    }

    await session.save();

    res.json({ message: 'Review submitted successfully', review: newReview, sessionStatus: session.status });
  } catch (err) {
    console.error('Error in review submission:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// Optionally, get reviews for a teacher
router.get('/teacher/:teacherId', authenticate, async (req, res) => {
  try {
    const reviews = await Review.find({ teacherId: req.params.teacherId }).populate('studentId', 'profile');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
