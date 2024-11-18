// utils/presenceManager.js
export class PresenceManager {
  static PING_INTERVAL = 30000; // 30 seconds
  static AWAY_TIMEOUT = 300000; // 5 minutes
  static OFFLINE_TIMEOUT = 600000; // 10 minutes

  constructor(socket, userId) {
    this.socket = socket;
    this.userId = userId;
    this.pingInterval = null;
    this.lastActivity = Date.now();
  }

  startTracking() {
    this.pingInterval = setInterval(() => this.ping(), PresenceManager.PING_INTERVAL);
    this.ping();
  }

  ping() {
    const timeSinceActivity = Date.now() - this.lastActivity;
    let status = 'online';

    if (timeSinceActivity > PresenceManager.OFFLINE_TIMEOUT) {
      status = 'offline';
    } else if (timeSinceActivity > PresenceManager.AWAY_TIMEOUT) {
      status = 'away';
    }

    this.socket.emit('presence:ping', {
      userId: this.userId,
      status,
      timestamp: Date.now()
    });
  }

  recordActivity() {
    this.lastActivity = Date.now();
  }

  stopTracking() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
  }
}