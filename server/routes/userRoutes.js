// authRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
    deleteUser,
    getAllUsers,
    updateUserProfile,
    getUser,
    searchUser,
    createUser,
    getUsersByRole
} = require('../controllers/userController');


// router.use(protect);


// Public routes
router.get('/', getAllUsers);
router.get('/search', searchUser)
router.get('/:id', getUser)
router.get('/role/search', getUsersByRole);

router.put('/:id', (req, res, next) => {
    updateUserProfile(req, res, next);
});

// Admin only routes
router.delete('/:id', protect, authorize, deleteUser);
  // Add this route with your other admin routes
router.post('/', protect, authorize('admin'), createUser);


// Protected routes
router.get('/check-verification', (req, res, next) => {
    console.log("Route handler for /check-verification reached");
    checkVerification(req, res, next);
});



module.exports = router;