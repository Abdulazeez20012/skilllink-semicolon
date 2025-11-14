const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Store active users
const activeUsers = new Map();

const setupChatSocket = (io) => {
  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }
      
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user._id})`);
    
    // Store active user
    activeUsers.set(socket.user._id.toString(), {
      socketId: socket.id,
      user: {
        id: socket.user._id,
        name: socket.user.name,
        avatar: socket.user.avatar
      }
    });
    
    // Join user's cohorts
    if (socket.user.cohorts && socket.user.cohorts.length > 0) {
      socket.user.cohorts.forEach(cohortId => {
        socket.join(`cohort:${cohortId}`);
      });
    }
    
    // Emit active users to all clients
    io.emit('activeUsers', Array.from(activeUsers.values()).map(u => u.user));
    
    // Handle joining a cohort room
    socket.on('joinCohort', (cohortId) => {
      socket.join(`cohort:${cohortId}`);
      console.log(`${socket.user.name} joined cohort ${cohortId}`);
    });
    
    // Handle leaving a cohort room
    socket.on('leaveCohort', (cohortId) => {
      socket.leave(`cohort:${cohortId}`);
      console.log(`${socket.user.name} left cohort ${cohortId}`);
    });
    
    // Handle sending a message
    socket.on('sendMessage', async (data) => {
      try {
        const { cohortId, content, type, fileUrl, fileName, fileSize, replyTo } = data;
        
        // Create message in database
        const message = await Message.create({
          cohort: cohortId,
          sender: socket.user._id,
          content,
          type: type || 'text',
          fileUrl,
          fileName,
          fileSize,
          replyTo
        });
        
        // Populate sender info
        await message.populate('sender', 'name avatar');
        
        // Emit message to cohort room
        io.to(`cohort:${cohortId}`).emit('newMessage', {
          id: message._id,
          cohortId: message.cohort,
          sender: {
            id: message.sender._id,
            name: message.sender.name,
            avatar: message.sender.avatar
          },
          content: message.content,
          type: message.type,
          fileUrl: message.fileUrl,
          fileName: message.fileName,
          fileSize: message.fileSize,
          isPinned: message.isPinned,
          replyTo: message.replyTo,
          createdAt: message.createdAt
        });
        
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // Handle typing indicator
    socket.on('typing', (data) => {
      const { cohortId, isTyping } = data;
      socket.to(`cohort:${cohortId}`).emit('userTyping', {
        userId: socket.user._id,
        userName: socket.user.name,
        isTyping
      });
    });
    
    // Handle message read
    socket.on('markAsRead', async (data) => {
      try {
        const { messageId } = data;
        
        const message = await Message.findById(messageId);
        if (message) {
          // Add user to readBy array if not already there
          const alreadyRead = message.readBy.some(
            r => r.user.toString() === socket.user._id.toString()
          );
          
          if (!alreadyRead) {
            message.readBy.push({
              user: socket.user._id,
              readAt: new Date()
            });
            await message.save();
            
            // Emit read receipt to cohort
            io.to(`cohort:${message.cohort}`).emit('messageRead', {
              messageId: message._id,
              userId: socket.user._id,
              userName: socket.user.name
            });
          }
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });
    
    // Handle pin message (facilitators only)
    socket.on('pinMessage', async (data) => {
      try {
        const { messageId, cohortId } = data;
        
        // Check if user is facilitator
        if (socket.user.role !== 'facilitator' && socket.user.role !== 'admin') {
          return socket.emit('error', { message: 'Only facilitators can pin messages' });
        }
        
        const message = await Message.findById(messageId);
        if (message) {
          message.isPinned = !message.isPinned;
          await message.save();
          
          // Emit to cohort
          io.to(`cohort:${cohortId}`).emit('messagePinned', {
            messageId: message._id,
            isPinned: message.isPinned
          });
        }
      } catch (error) {
        console.error('Error pinning message:', error);
      }
    });
    
    // Handle delete message
    socket.on('deleteMessage', async (data) => {
      try {
        const { messageId, cohortId } = data;
        
        const message = await Message.findById(messageId);
        
        // Only sender or facilitator can delete
        if (message && (
          message.sender.toString() === socket.user._id.toString() ||
          socket.user.role === 'facilitator' ||
          socket.user.role === 'admin'
        )) {
          await message.deleteOne();
          
          // Emit to cohort
          io.to(`cohort:${cohortId}`).emit('messageDeleted', {
            messageId: message._id
          });
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
      activeUsers.delete(socket.user._id.toString());
      
      // Emit updated active users
      io.emit('activeUsers', Array.from(activeUsers.values()).map(u => u.user));
    });
  });
};

module.exports = setupChatSocket;
