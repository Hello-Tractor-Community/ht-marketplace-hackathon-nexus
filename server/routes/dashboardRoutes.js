// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getUserMetrics, getListingMetrics } = require('../controllers/dashboardController');

// Protected routes - only accessible by admin
router.get('/metrics/users', protect, authorize('admin'), getUserMetrics);
router.get('/metrics/listings', protect, authorize('admin'), getListingMetrics);

module.exports = router;