const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Message = require('../models/Message');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

module.exports = (io) => {
  // Authentication middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }
      const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
      
      const decoded = jwt.verify(actualToken, JWT_SECRET);
      const userId = decoded.id || decoded.userId || decoded._id;

      let user = await Student.findById(userId);
      let role = null;
      if (user) {
        role = 'Student';
      } else {
        user = await Teacher.findById(userId);
        if (user) role = 'Teacher';
      }

      if (!role) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = { id: userId.toString(), role: role };
      next();
    } catch (err) {
      console.error('Socket Auth Error:', err.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id} (${socket.user.role})`);

    // Join session room
    socket.on('join_session', (sessionId) => {
      socket.join(sessionId);
      console.log(`User ${socket.user.id} joined session ${sessionId}`);
      
      // Notify others in room
      socket.to(sessionId).emit('user_joined', { userId: socket.user.id, role: socket.user.role });
    });

    // Chat Message
    socket.on('send_message', async (data) => {
      try {
        const { sessionId, messageType, content, fileUrl } = data;
        
        // Save to DB
        const newMessage = new Message({
          sessionId,
          senderId: socket.user.id,
          senderRole: socket.user.role,
          messageType: messageType || 'text',
          content,
          fileUrl,
        });
        await newMessage.save();

        // Broadcast to room
        io.to(sessionId).emit('receive_message', newMessage);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    });

    // WebRTC Signaling Events
    socket.on('webrtc_offer', (data) => {
      socket.to(data.sessionId).emit('webrtc_offer', {
        offer: data.offer,
        senderId: socket.user.id
      });
    });

    socket.on('webrtc_answer', (data) => {
      socket.to(data.sessionId).emit('webrtc_answer', {
        answer: data.answer,
        senderId: socket.user.id
      });
    });

    socket.on('webrtc_ice_candidate', (data) => {
      socket.to(data.sessionId).emit('webrtc_ice_candidate', {
        candidate: data.candidate,
        senderId: socket.user.id
      });
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.id}`);
      // Would ideally emit user_left if we track rooms explicitly
    });
  });
};
