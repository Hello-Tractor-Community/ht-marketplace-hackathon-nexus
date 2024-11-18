// Backend socket handling (socket.js)
const handleSocket = (io) => {
  const presenceTimeouts = new Map();
  io.on('connection', (socket) => {
    socket.on('presence:ping', async ({ userId, status, timestamp }) => {
      // Clear existing timeout
      if (presenceTimeouts.has(userId)) {
        clearTimeout(presenceTimeouts.get(userId));
      }

      // Set new timeout
      const timeout = setTimeout(async () => {
        await UserPresence.findOneAndUpdate(
          { user: userId },
          { status: 'offline', lastActive: Date.now() }
        );
        io.emit('presenceUpdate', { 
          userId, 
          status: 'offline',
          timestamp: Date.now()
        });
      }, PresenceManager.OFFLINE_TIMEOUT);

      presenceTimeouts.set(userId, timeout);

      // Update presence
      await UserPresence.findOneAndUpdate(
        { user: userId },
        { 
          status,
          lastActive: timestamp,
          lastPing: Date.now()
        },
        { upsert: true }
      );

      io.emit('presenceUpdate', { userId, status, timestamp });
    });

    socket.on('typing', ({ conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit('userTyping', {
        userId: socket.userId,
        conversationId
      });
    });

    socket.on('stopTyping', ({ conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit('userStoppedTyping', {
        userId: socket.userId,
        conversationId
      });
    });

    socket.on('disconnect', () => {
      // Clean up any presence timeouts
      if (socket.userId && presenceTimeouts.has(socket.userId)) {
        clearTimeout(presenceTimeouts.get(socket.userId));
        presenceTimeouts.delete(socket.userId);
      }
    });
  });
};