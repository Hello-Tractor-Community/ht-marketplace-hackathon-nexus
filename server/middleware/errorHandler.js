// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err);
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        error: messages.join(',')
      });
    }
  
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Resource not found'
      });
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, token failed'
      });
    }
  
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Server Error'
    });
  };
  
  module.exports = errorHandler;