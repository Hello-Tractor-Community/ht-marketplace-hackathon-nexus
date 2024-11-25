
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
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

// Public routes
router.get('/', getListings);
router.get('/search', searchListings);
router.get('/:id', getListingById);


// Protected routes
router.patch('/:id/status', protect, updateListingStatus);
router.patch('/:id/inventory', protect, updateListingInventory);


router.route('/:id')
    .put(protect,  updateListing)
    .delete(protect, deleteListing);
router.post('/', protect, createListing);

module.exports = router;



