// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// In auth.js
const protect = (req, res, next) => {
  try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
          return res.status(401).json({
              success: false,
              message: 'Please authenticate'
          });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Async user lookup wrapped in Promise
      User.findById(decoded._id)
          .select('-password')
          .then(user => {
              if (!user) {
                  return res.status(401).json({
                      success: false,
                      message: 'User not found'
                  });
              }
              req.user = user;
              next();
          })
          .catch(err => {
              console.error('Database error in protect middleware:', err);
              return res.status(500).json({
                  success: false,
                  message: 'Internal server error'
              });
          });

  } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({
          success: false,
          message: 'Invalid authentication'
      });
  }
};

// Role based
const authorize = (allowedRoles = ['seller', 'admin']) => {
  return async (req, res, next) => {
    try {
      // Make sure the user is available from the protect middleware
      const user = req.user; 

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log("Authorize..user found");

      // Check if the user has either 'seller' or 'admin' in their platformRoles
      const hasValidRole = user.platformRoles.some(role => allowedRoles.includes(role));

      if (!hasValidRole) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Attach the user to the request object for further use in route handlers
      req.user = user;
      next(); // Continue to the next middleware/route handler
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};




// Middleware for company-specific routes
const verifyCompany = async (req, res, next) => {
  if (!req.user.platformRoles.includes('seller') || !req.user.companyProfile) {
      return res.status(403).json({
          success: false,
          error: 'This route is only accessible to verified companies'
      });
  }
  next();
};

// Temporary authentication bypass middleware
// const bypassAuth = (req, res, next) => {
//     // Simulate a user for testing

//     req.user = {
//       _id: '673f02a4b9ac057d09dd84f9', // Buyer ID
//       firstName: 'Buyer',
//       lastName: 'Natnael'
//     };
//     next();
//   };

// const bypassAdminAuth = (req, res, next) => {
//     // Simulate a user for testing

//     req.user = {
//       _id: '674033c9817b64e78c93e818', // Admin ID
//       firstName: 'Admin',
//       lastName: 'Hello_tractor',
//       platformRoles: ['admin']
//     };
//     next();
//   };

module.exports = { 
    protect, 
    authorize, 
    verifyCompany,
    // bypassAuth,
    // bypassAdminAuth

};