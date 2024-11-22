// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

const protect = async (req, res, next) => {
    console.log("protect..", req.headers.authorization);
    try {
        let token;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id)
                .select('-password')
                .populate({
                    path: 'companyAssociations.company',
                    model: 'Company',
                    select: 'companyName companyType registrationStatus location'
                });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Not authorized, user not found'
                });
            }

            // Modified account status check to allow pending users for specific endpoints
            if (user.accountStatus !== 'active' && user.accountStatus !== 'pending') {
                return res.status(401).json({
                    success: false,
                    error: `Account is ${user.accountStatus}. Please contact support.`
                });
            }

            // Update last login
            user.lastLogin = Date.now();
            await user.save();

            req.user = user;
            next();
        } else {
            return res.status(401).json({
                success: false,
                error: 'Not authorized, no token'
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized, token failed',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
// Role based
const authorize = (allowedRoles) => {
    
    return async (req, res, next) => {
      try {
        const user = await User.findById(req.user.id);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        console.log("Authorize..user found");
  
        // Check if the user has an active company association with one of the allowed roles
        const association = user.companyAssociations.find(
          (assoc) => allowedRoles.includes(assoc.role) && assoc.status === 'active'
        );
        if (!association) {
          return res.status(403).json({ error: 'Forbidden' });
        }
  
        // Attach the association to the request object
        req.companyAssociation = association;
        next();
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    };
  };

// Middleware for company-specific routes
const verifyCompany = async (req, res, next) => {
    if (req.user.role !== 'artisan' || !req.user.companyProfile) {
        return res.status(403).json({
            success: false,
            error: 'This route is only accessible to verified companyes'
        });
    }
    next();
};

// Temporary authentication bypass middleware
const bypassAuth = (req, res, next) => {
    // Simulate a user for testing

    req.user = {
      _id: '673f02a4b9ac057d09dd84f9', // Buyer ID
      firstName: 'Buyer',
      lastName: 'Natnael'
    };
    next();
  };

const bypassAdminAuth = (req, res, next) => {
    // Simulate a user for testing

    req.user = {
      _id: '674033c9817b64e78c93e818', // Admin ID
      firstName: 'Admin',
      lastName: 'Hello_tractor',
      platformRoles: ['admin']
    };
    next();
  };

module.exports = { 
    protect, 
    authorize, 
    verifyCompany,
    bypassAuth,
    bypassAdminAuth

};