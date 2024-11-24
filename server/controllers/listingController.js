// controllers/listingController.js
const Listing = require('../models/Listing');
const User = require('../models/User'); // Assuming User model exists
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const createListing = asyncHandler(async (req, res) => {
    const {
        name,
        sku,
        category,
        seller,
        description,
        make,
        model,
        serviceHours,
        price,
        images,
        location,
        status,
        visibility,
        inventory,
        metrics
    } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(seller)) {
        res.status(400);
        throw new Error('Invalid seller ID');
    }

    // Check seller exists
    const foundSeller = await User.findById(seller);
    if (!foundSeller) {
        res.status(404);
        throw new Error('Seller not found');
    }

    // Check SKU uniqueness
    const existingSku = await Listing.findOne({ sku });
    if (existingSku) {
        res.status(400);
        throw new Error('SKU already exists');
    }

    const user = req.user._id;

    const listing = await Listing.create({
        name,
        sku,
        category,
        user,
        seller,
        description,
        make,
        model,
        serviceHours,
        price,
        images,
        location,
        status,
        visibility,
        inventory,
        metrics
    });

    res.status(201).json({
        success: true,
        data: listing
    });
});

const getListings = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log("getListings request..");

    // Build filter object
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.make) filter.make = req.query.make;
    if (req.query.model) filter.model = req.query.model;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.user) filter.user = req.query.user;

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
        filter['price.amount'] = {};
        if (req.query.minPrice) filter['price.amount'].$gte = parseFloat(req.query.minPrice);
        if (req.query.maxPrice) filter['price.amount'].$lte = parseFloat(req.query.maxPrice);
    }

    // Build sort object
    let sort = {};
    switch (req.query.sort) {
        case 'price_asc':
            sort = { 'price.amount': 1 };
            break;
        case 'price_desc':
            sort = { 'price.amount': -1 };
            break;
        case 'newest':
            sort = { createdAt: -1 };
            break;
        case 'popular':
            sort = { 'metrics.totalSales': -1 };
            break;
        default:
            sort = { createdAt: -1 };
    }

    const [listings, total] = await Promise.all([
        Listing.find(filter)
            .populate({
                path: 'user',
                select: 'firstName lastName'
            })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
        Listing.countDocuments(filter)
    ]);

    res.status(200).json({
        success: true,
        data: listings,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

const searchListings = asyncHandler(async (req, res) => {
    const { q, category, make, model, minPrice, maxPrice } = req.query;
    const query = {};

    // Text search
    if (q) {
        query.$text = { $search: q };
    }

    // Category filters
    if (category) query.category = category;
    if (make) query.make = make;
    if (model) query.model = model;

    // Price range
    if (minPrice || maxPrice) {
        query['price.amount'] = {};
        if (minPrice) query['price.amount'].$gte = parseFloat(minPrice);
        if (maxPrice) query['price.amount'].$lte = parseFloat(maxPrice);
    }

    // Only show active listings
    query.status = 'active';

    const listings = await Listing.find(query)
        .populate({
            path: 'user',
            select: 'firstName lastName'
        })
        .sort(q ? { score: { $meta: 'textScore' } } : { 'metrics.totalSales': -1 })
        .limit(20);

    res.status(200).json({
        success: true,
        count: listings.length,
        data: listings
    });
});

const getListingById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid listing ID');
    }

    const listing = await Listing.findById(req.params.id)
        .populate({
            path: 'user',
            select: 'firstName lastName'
        });

    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }

    // Increment view count
    await Listing.findByIdAndUpdate(req.params.id, {
        $inc: { 'metrics.views': 1 }
    });

    console.log("listing..",listing);

    res.status(200).json({
        success: true,
        data: listing
    });
});

const updateListing = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid listing ID');
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }

    // Check authorization is not working in postman
    // // Check authorization
    // if (listing.user.toString() !== req.user._id.toString()) {
    //     res.status(403);
    //     throw new Error('Not authorized to update this listing');
    // }

    // Check SKU uniqueness if being updated
    if (req.body.sku && req.body.sku !== listing.sku) {
        const existingSku = await Listing.findOne({ sku: req.body.sku });
        if (existingSku) {
            res.status(400);
            throw new Error('SKU already exists');
        }
    }

    const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: updatedListing
    });
});

const deleteListing = asyncHandler(async (req, res) => {
    console.log("Attempting to delete listing..");
    console.log("req params..",req.params);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid listing ID');
    }

    const listing = await Listing.findById(req.params.id);
    console.log("listing..",listing);

    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }

    // Check authorization
    if (listing.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this listing');
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Listing removed successfully'
    });
});

const updateListingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['draft', 'active', 'inactive', 'archived'];

    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid status value');
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid listing ID');
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }

    // Check authorization
    if (listing.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this listing');
    }

    const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    res.status(200).json({
        success: true,
        data: updatedListing
    });
});

const updateListingInventory = asyncHandler(async (req, res) => {
    const { quantity, lowStockThreshold, allowBackorder } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid listing ID');
    }

    if (quantity !== undefined && quantity < 0) {
        res.status(400);
        throw new Error('Quantity cannot be negative');
    }

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        res.status(404);
        throw new Error('Listing not found');
    }

    // Check authorization
    if (listing.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this listing');
    }

    const inventoryUpdate = {};
    if (quantity !== undefined) inventoryUpdate['inventory.quantity'] = quantity;
    if (lowStockThreshold !== undefined) inventoryUpdate['inventory.lowStockThreshold'] = lowStockThreshold;
    if (allowBackorder !== undefined) inventoryUpdate['inventory.allowBackorder'] = allowBackorder;

    const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        { $set: inventoryUpdate },
        { new: true }
    );

    res.status(200).json({
        success: true,
        data: updatedListing
    });
});

const getFeaturedListings = asyncHandler(async (req, res) => {
    const listings = await Listing.find({
        status: 'active',
        'visibility.isFeatured': true
    })
        .populate({
            path: 'user',
            select: 'firstName lastName'
        })
        .sort({ 'metrics.totalSales': -1 })
        .limit(10);

    res.status(200).json({
        success: true,
        count: listings.length,
        data: listings
    });
});

const getNewArrivals = asyncHandler(async (req, res) => {
    const listings = await Listing.find({
        status: 'active',
        'visibility.isNewArrival': true
    })
        .populate({
            path: 'user',
            select: 'firstName lastName'
        })
        .sort({ createdAt: -1 })
        .limit(12);

    res.status(200).json({
        success: true,
        count: listings.length,
        data: listings
    });
});

const getListingsByCompany = asyncHandler(async (req, res) => {
    const companyId = req.params.companyId;
    const listings = await Listing.find({ user: companyId })
        .populate({
            path: 'user',
            select: 'firstName lastName'
        })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: listings.length,
        data: listings
    });
});
module.exports = {
    createListing,
    getListings,
    getListingById,
    updateListing,
    deleteListing,
    searchListings,
    updateListingStatus,
    updateListingInventory,
    getFeaturedListings,
    getListingsByCompany,
    getNewArrivals
};