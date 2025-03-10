const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const consultationRoutes = require('./routes/consultations');
const prescriptionRoutes = require('./routes/prescriptions');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://chaitanyarathod811:Chaitanya2003@medicalcunconsultation.192ee.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join a room (for private consultations)
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });
  
  // Handle video call signaling
  socket.on('call-user', ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit('call-user', { signal: signalData, from, name });
  });
  
  socket.on('answer-call', (data) => {
    io.to(data.to).emit('call-accepted', data.signal);
  });
  
  // Handle chat messages
  socket.on('send-message', (data) => {
    io.to(data.room).emit('receive-message', data);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 