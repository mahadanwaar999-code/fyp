const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const LectureRequest = require('../models/LectureRequest');
const LectureSession = require('../models/LectureSession');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const KYC = require('../models/KYC');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authenticate = require('../middleware/auth');

// Debug route to check role
router.get('/debug', authenticate, (req, res) => {
  res.json({ 
    user: req.user,
    roleType: typeof req.user.role,
    roleLength: req.user.role?.length
  });
});

// Create a lecture request
router.post('/request', authenticate, async (req, res) => {
  try {
    const { teacherId, message, requestedDate, scheduledTime, duration, weakAreas } = req.body;

    if (!teacherId || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: 'Valid Teacher ID is required' });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ 
        message: 'Only students can request lectures',
        yourRole: req.user.role,
        yourId: req.user.id
      });
    }

    const studentId = new mongoose.Types.ObjectId(req.user.id);
    const teacherIdObj = new mongoose.Types.ObjectId(teacherId);

    const student = await Student.findById(studentId);
    if (!student) {
        return res.status(404).json({ message: 'Student profile not found' });
    }

    const lectureRequest = new LectureRequest({
      studentId: studentId,
      teacherId: teacherIdObj,
      requestedDate: requestedDate || new Date(),
      message: message || '',
      scheduledTime: scheduledTime || new Date(),
      duration: duration || 60,
      weakAreas: weakAreas || '',
      status: 'pending'
    });
    await lectureRequest.save();

    const notification = new Notification({
      userId: teacherIdObj,
      userModel: 'Teacher',
      title: 'New Lecture Request',
      message: `You have a new lecture request from ${student.profile?.fullName || 'a student'}`,
      type: 'request_sent',
      metadata: { requestId: lectureRequest._id }
    });
    await notification.save();

    res.status(201).json({ message: 'Request sent successfully', lectureRequest });
  } catch (err) {
    console.error('CRITICAL BACKEND ERROR IN /api/requests/request:', err);
    res.status(500).json({ 
        message: 'Internal Server Error during lecture request', 
        error: err.message,
        details: err.stack,
        code: err.code
    });
  }
});

// Teacher: Accept Request
router.post('/accept/:requestId', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Unauthorized' });

    const request = await LectureRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Check Teacher KYC 
    const teacher = await Teacher.findById(req.user.id).populate('kyc');
    // if (teacher.kyc.status !== 'approved') return res.status(400).json({ message: 'KYC verification required' });

    request.status = 'accepted';
    await request.save();

    // Create LectureSession
    const session = new LectureSession({
      requestId: request._id,
      studentId: request.studentId,
      teacherId: request.teacherId,
      status: 'scheduled'
    });
    await session.save();

    // Notify Student
    const notification = new Notification({
      userId: request.studentId,
      userModel: 'Student',
      title: 'Request Accepted',
      message: `Your lecture request has been accepted by teacher ${req.user.id}`,
      type: 'request_accepted',
      metadata: { requestId: request._id }
    });
    await notification.save();

    res.json({ message: 'Request accepted', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Teacher: Reject Request
router.post('/reject/:requestId', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Unauthorized' });

    const request = await LectureRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    await request.save();

    // Notify Student
    const notification = new Notification({
      userId: request.studentId,
      userModel: 'Student',
      title: 'Request Rejected',
      message: `Your lecture request has been rejected.`,
      type: 'request_rejected',
      metadata: { requestId: request._id }
    });
    await notification.save();

    res.json({ message: 'Request rejected', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', details: err.message });
  }
});
// Complete Lecture
router.post('/complete/:requestId', authenticate, async (req, res) => {
  try {
    const request = await LectureRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'accepted') return res.status(400).json({ message: 'Only accepted lectures can be completed' });

    request.status = 'completed';
    await request.save();

    // Notify Teacher
    const teacherNotif = new Notification({
      userId: request.teacherId,
      userModel: 'Teacher',
      title: 'Lecture Completed',
      message: `The lecture session has been completed.`,
      type: 'lecture_completed'
    });
    await teacherNotif.save();

    res.json({ message: 'Lecture completed', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', details: err.message });
  }
});

router.get('/student', authenticate, async (req, res) => {
  try {
    const requests = await LectureRequest.find({ studentId: req.user.id }).populate('teacherId', 'profile');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Teacher Requests (Teacher Panel)
router.get('/teacher', authenticate, async (req, res) => {
  try {
    const requests = await LectureRequest.find({ teacherId: req.user.id, status: 'pending' }).populate('studentId', 'profile');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Active Students (Accepted Requests) for Teacher
router.get('/active-students', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Unauthorized' });
    const requests = await LectureRequest.find({ teacherId: req.user.id, status: 'accepted' }).populate('studentId', 'profile');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
