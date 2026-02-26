const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

// Pass io to request object if needed
app.use((req, res, next) => {
  req.io = io;
  next();
});
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public/listening-media', express.static('public/listening-media'));
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ielts_listening', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
const listeningRoutes = require('./routes/listening');
const readingRoutes = require('./routes/reading');
const writingRoutes = require('./routes/writing');
const speakingRoutes = require('./routes/speaking');
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teachers');
const requestRoutes = require('./routes/requests');
const walletRoutes = require('./routes/wallet');
const notificationRoutes = require('./routes/notifications');
const lectureSessionsRoutes = require('./routes/lectureSessions');
const reviewsRoutes = require('./routes/reviews');
app.use('/api/listening', listeningRoutes);
app.use('/api/reading', readingRoutes);
app.use('/api/writing', writingRoutes);
app.use('/api/speaking', speakingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/lecture-sessions', lectureSessionsRoutes);
app.use('/api/reviews', reviewsRoutes);

// Serve Writing images
app.use('/Writing', express.static('../Writing'));

// Basic route
app.get('/', (req, res) => {
    res.send('IELTS Listening Test API is running');
});

// Socket Logic
const initLectureSockets = require('./sockets/lectureSocket');
initLectureSockets(io);

// Start Server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
