// authRoutes.js
const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    logoutUser,
    getUserProfile, 
    updateUserProfile,
    verifyEmail,
    resendVerification,
    checkVerification,
    addCompanyAssociation,
    addOperatorDetails,
    googleAuth,
    googleCallback,
    facebookAuth,
    facebookCallback
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/company-association', addCompanyAssociation);
router.post('/operator-details',addOperatorDetails);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/verify/:token', verifyEmail);

// Social authentication routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/facebook', facebookAuth);
router.get('/facebook/callback', facebookCallback);

// Protected routes
router.use(protect);  // Apply protection to all routes below
// Protected routes
router.get('/check-verification', (req, res, next) => {
    console.log("Route handler for /check-verification reached");
    checkVerification(req, res, next);
});
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.post('/verify/resend', resendVerification);



module.exports = router;