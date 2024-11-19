// listingRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize, verifyCompany } = require('../middleware/auth');
const { checkOnboardingStatus } = require('../middleware/validation');
const {
    createListing,
    getListings,
    getListingById,
    updateListing,
    deleteListing,
    searchListings,
    updateListingStatus,
    updateListingInventory,
    getListingsByBusiness,
    getFeaturedListings,
    getNewArrivals
} = require('../controllers/listingController');

// Public routes
router.get('/', getListings);
router.get('/search', searchListings);
router.get('/featured', getFeaturedListings);
router.get('/new-arrivals', getNewArrivals);
router.get('/business/:businessId', getListingsByBusiness);
router.get('/:id', getListingById);

// Protected routes
router.use(protect);

// Business owner routes
router.use(verifyCompany);
router.use(checkOnboardingStatus);

router.post('/', createListing);
router.route('/:id')
    .put(updateListing)
    .delete(deleteListing);

router.put('/:id/status', updateListingStatus);
router.put('/:id/inventory', updateListingInventory);

module.exports = router;