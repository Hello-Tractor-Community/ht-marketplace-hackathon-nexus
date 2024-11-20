// authRoutes.js
const express = require('express');
const router = express.Router();
const { 
    deleteUser,
    getAllUsers,
    updateUserProfile,
    getUser,
    searchUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// router.use(protect);


// Public routes
router.get('/', getAllUsers);
router.get('/search', searchUser)
router.get('/:id', getUser)

router.put('/:id', (req, res, next) => {
    updateUserProfile(req, res, next);
});

// Admin only routes
router.delete('/:id', deleteUser);


// Protected routes
router.get('/check-verification', (req, res, next) => {
    console.log("Route handler for /check-verification reached");
    checkVerification(req, res, next);
});



module.exports = router;