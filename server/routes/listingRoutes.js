// // listingRoutes.js
// const express = require('express');
// const router = express.Router();
// const { protect, authorize,  } = require('../middleware/auth');
// const { checkOnboardingStatus } = require('../middleware/validation');

// console.log('Loading listing routes...');
// console.log('Protect middleware:', typeof protect);
// const {
//     createListing,
//     getListings,
//     getListingById,
//     updateListing,
//     deleteListing,
//     searchListings,
//     updateListingStatus,
//     updateListingInventory,
//     getListingsByCompany,
//     getFeaturedListings,
//     getNewArrivals
// } = require('../controllers/listingController');

// // Public routes
// // Create Listing

// router.get('/', getListings);
// router.get('/search', searchListings);
// router.get('/featured', getFeaturedListings);
// router.get('/new-arrivals', getNewArrivals);
// router.get('/company/:companyId', getListingsByCompany);
// router.get('/:id', getListingById);

// // Protected routes
// // Instead of router.use(), apply the middleware directly to the routes that need it
// router.post('/', protect, createListing);

// router.route('/:id')
//     .put(protect,  updateListing)
//     .delete(protect, deleteListing);


const express = require('express');
const router = express.Router();
const { protect,bypassSellerAuth } = require('../middleware/auth');
const {
    createListing,
    getListings,

    getListingById,

    searchListings,
    updateListingStatus,
    updateListingInventory,
    updateListing,
    deleteListing,
} = require('../controllers/listingController');

// Test with just two routes - one public and one protected
router.get('/', getListings);
router.get('/:id', getListingById);
router.get('/search', searchListings);
router.get('/listing', searchListings);

router.patch('/:id/status', protect, updateListingStatus);
router.patch('/:id/inventory', protect, updateListingInventory);


router.route('/:id')
    .put(protect,  updateListing)
    .delete(protect, deleteListing);
router.post('/', bypassSellerAuth, createListing);

module.exports = router;



