const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || decoded.userId || decoded._id;
    
    // Always verify role against DB to ensure accuracy
    let user = await Student.findById(userId);
    let role = null;
    
    if (user) {
      role = 'student';
    } else {
      user = await Teacher.findById(userId);
      if (user) {
        role = 'teacher';
      }
    }

    if (!role) {
      console.log(`Auth Failed: User ${userId} not found in either collection`);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      ...decoded,
      id: userId,
      role: role
    };
    
    next();
  } catch (err) {
    console.error('Authentication Error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
