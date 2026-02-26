const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const LectureSession = require('../models/LectureSession');
const Message = require('../models/Message');
const SharedFile = require('../models/SharedFile');
const authenticate = require('../middleware/auth');

// Setup multer for local file storage if not using cloud
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only pdf, docx, and images are allowed!'));
    }
  }
});

// Upload media recording chunk
const recordingStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/recordings/'); // ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, `rec_${req.params.sessionId}_${Date.now()}.webm`); 
  }
});
const uploadRecording = multer({ storage: recordingStorage });

// Fetch active session details by Request ID
router.get('/by-request/:requestId', authenticate, async (req, res) => {
  try {
    const session = await LectureSession.findOne({ requestId: req.params.requestId })
      .populate('studentId', 'profile')
      .populate('teacherId', 'profile');
      
    if (!session) {
      return res.status(404).json({ message: 'Session not found for this request' });
    }

    // Role-based auth
    if (req.user.role === 'student' && session.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (req.user.role === 'teacher' && session.teacherId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Fetch active session details
router.get('/:sessionId', authenticate, async (req, res) => {
  try {
    const session = await LectureSession.findById(req.params.sessionId)
      .populate('studentId', 'profile')
      .populate('teacherId', 'profile');
      
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Role-based auth
    if (req.user.role === 'student' && session.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (req.user.role === 'teacher' && session.teacherId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Upload file in chat
router.post('/:sessionId/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    const session = await LectureSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Validate participant
    const isParticipant =
      (req.user.role === 'student' && session.studentId.toString() === req.user.id) ||
      (req.user.role === 'teacher' && session.teacherId.toString() === req.user.id);
      
    if (!isParticipant) return res.status(403).json({ message: 'Unauthorized' });

    const fileUrl = `/uploads/${req.file.filename}`;
    
    const sharedFile = new SharedFile({
      sessionId: session._id,
      uploaderId: req.user.id,
      uploaderRole: req.user.role,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl: fileUrl,
    });
    await sharedFile.save();

    res.json({ message: 'File uploaded', fileUrl, sharedFile: sharedFile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Upload recording chunk at end of session (simple version)
router.post('/:sessionId/recording', authenticate, uploadRecording.single('video'), async (req, res) => {
  try {
    const session = await LectureSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // In a prod app, chunks would be appended. Here we just expect one blob uploaded at end
    const recordingUrl = `/uploads/recordings/${req.file.filename}`;
    session.recordingUrl = recordingUrl;
    session.recordingStatus = 'temporary';
    await session.save();

    res.json({ message: 'Recording uploaded', recordingUrl });
  } catch (err) {
    console.error('Upload recording error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update session status
router.patch('/:sessionId/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const session = await LectureSession.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.status = status;
    if (status === 'completed') {
       session.endTime = new Date();
    } else if (status === 'live' && !session.startTime) {
       session.startTime = new Date();
    }
    
    await session.save();
    res.json({ message: 'Status updated', session });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get messages for a session
router.get('/:sessionId/messages', authenticate, async (req, res) => {
  try {
    const messages = await Message.find({ sessionId: req.params.sessionId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
