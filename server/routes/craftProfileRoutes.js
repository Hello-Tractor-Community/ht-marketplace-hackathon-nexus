// craftProfileRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createUpdateProfile,
    getProfile,
    addCertification,
    addPortfolioItem,
    removePortfolioItem,
    searchProfiles
} = require('../controllers/craftProfileController');

// Public routes
router.get('/search', searchProfiles);
router.get('/:id', getProfile);

// Protected routes - all require artisan role
router.use(protect);
router.use(authorize('artisan'));

router.route('/')
    .post(createUpdateProfile)
    .put(createUpdateProfile);

router.post('/certifications', addCertification);
router.post('/portfolio', addPortfolioItem);
router.delete('/portfolio/:itemId', removePortfolioItem);

module.exports = router;