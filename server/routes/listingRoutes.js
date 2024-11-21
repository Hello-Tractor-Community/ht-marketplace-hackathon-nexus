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
// Create Listing
router.post('/', createListing);
router.get('/', getListings);
router.get('/search', searchListings);
router.get('/featured', getFeaturedListings);
router.get('/new-arrivals', getNewArrivals);
router.get('/business/:businessId', getListingsByBusiness);
router.get('/:id', getListingById);
// crud operation on listing should be protected
router.post('/', createListing);

// Protected routes
// router.use(protect);

// Business owner routes
router.use(verifyCompany);
// router.use(checkOnboardingStatus);


router.route('/:id')
    .put(updateListing)
    .delete(deleteListing);

router.put('/:id/status', updateListingStatus);
router.put('/:id/inventory', updateListingInventory);

module.exports = router;