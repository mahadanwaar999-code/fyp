const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Wallet = require('../models/Wallet');
const KYC = require('../models/KYC');
const Joi = require('joi');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png) are allowed'));
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Validation Schemas
const signupSchema = Joi.object({
  role: Joi.string().valid('student', 'teacher').required(),
  fullName: Joi.string().required(),
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
  password: Joi.string().min(6).required(),
  photoUrl: Joi.string().allow(''),
  ieltsCertificate: Joi.string().when('role', { 
    is: 'teacher', 
    then: Joi.required(), 
    otherwise: Joi.allow('').optional() 
  }),
  location: Joi.object({
    ip: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    device: Joi.string()
  })
}).xor('email', 'phoneNumber');

const loginSchema = Joi.object({
  identifier: Joi.string().required(), // email or phone
  password: Joi.string().required(),
  location: Joi.object({
    ip: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    device: Joi.string()
  }).optional()
});

// Generate JWT Helper
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { role, fullName, email, phoneNumber, password, photoUrl, ieltsCertificate, location } = req.body;

    const Model = role === 'student' ? Student : Teacher;

    // Check if user already exists
    const query = email ? { 'auth.email': email } : { 'auth.phoneNumber': phoneNumber };
    const existingUser = await Model.findOne(query);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new Model({
      auth: { email, phoneNumber, password },
      profile: { fullName, photoUrl, ieltsCertificate, location },
      logins: [{ location }]
    });

    await newUser.save();

    // Initialize Wallet
    const newWallet = new Wallet({
      userId: newUser._id,
      userModel: role === 'student' ? 'Student' : 'Teacher'
    });
    await newWallet.save();

    // Initialize KYC
    const newKYC = new KYC({
      userId: newUser._id,
      userModel: role === 'student' ? 'Student' : 'Teacher',
      status: 'pending',
      documentType: 'initial',
      documentUrl: 'pending'
    });
    await newKYC.save();

    // Link back to user
    newUser.wallet = newWallet._id;
    newUser.kyc = newKYC._id;
    await newUser.save();

    const token = generateToken(newUser._id, role);
    res.status(201).json({ token, role, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { identifier, password } = req.body;

    // Check both roles
    let user = await Student.findOne({ $or: [{ 'auth.email': identifier }, { 'auth.phoneNumber': identifier }] });
    let role = 'student';

    if (!user) {
      user = await Teacher.findOne({ $or: [{ 'auth.email': identifier }, { 'auth.phoneNumber': identifier }] });
      role = 'teacher';
    }

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Track Login
    const loginEntry = {
      datetime: new Date(),
      location: req.body.location || {} // Expecting location details from frontend
    };
    user.logins.push(loginEntry);
    await user.save();

    const token = generateToken(user._id, role);
    res.json({ token, role, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get Me Route
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || decoded.userId || decoded._id;
    let role = decoded.role;
    let user;

    if (role && role.toLowerCase() === 'student') {
      user = await Student.findById(userId).select('-auth.password');
    } else if (role && role.toLowerCase() === 'teacher') {
      user = await Teacher.findById(userId).select('-auth.password');
    } else {
      // Fallback/Lookup logic
      user = await Student.findById(userId).select('-auth.password');
      if (user) {
        role = 'student';
      } else {
        user = await Teacher.findById(userId).select('-auth.password');
        if (user) role = 'teacher';
      }
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user, role: role.toLowerCase() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Profile Route
router.post('/update-profile', upload.single('photo'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { fullName } = req.body;
    const photoUrl = req.file ? req.file.filename : undefined;

    const Model = decoded.role === 'student' ? Student : Teacher;
    const user = await Model.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName) user.profile.fullName = fullName;
    if (photoUrl) user.profile.photoUrl = photoUrl;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update Password Route
router.post('/update-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required' });
    }

    const Model = decoded.role === 'student' ? Student : Teacher;
    const user = await Model.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    user.auth.password = newPassword; // Mongoose middleware will hash this
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
