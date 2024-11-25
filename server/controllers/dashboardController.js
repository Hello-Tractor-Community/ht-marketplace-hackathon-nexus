// controllers/dashboardController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Listing = require('../models/Listing');

const getUserMetrics = asyncHandler(async (req, res) => {
    console.log("User metrics reached.");
    try {
        // Get total users count
        const totalUsers = await User.countDocuments();

        // Get counts by status
        const statusCounts = await User.aggregate([
            {
                $group: {
                    _id: '$accountStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert to a more friendly format
        const metrics = {
            total: totalUsers,
            byStatus: {
                pending: 0,
                active: 0,
                suspended: 0,
                deactivated: 0
            }
        };

        // Fill in the counts
        statusCounts.forEach(status => {
            metrics.byStatus[status._id] = status.count;
        });

        // Get users registered in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentUsers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        metrics.recentUsers = recentUsers;

        // Get user registration trends (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyTrends = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        metrics.dailyTrends = dailyTrends;

        res.status(200).json({
            success: true,
            data: metrics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching user metrics'
        });
    }
});

const getListingMetrics = asyncHandler(async (req, res) => {
    try {
        // Get total listings count
        const totalListings = await Listing.countDocuments();

        // Get counts by status
        const statusCounts = await Listing.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert to a more friendly format
        const metrics = {
            total: totalListings,
            byStatus: {
                draft: 0,
                active: 0,
                inactive: 0,
                archived: 0
            }
        };

        // Fill in the counts
        statusCounts.forEach(status => {
            metrics.byStatus[status._id] = status.count;
        });

        // Get listings created in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentListings = await Listing.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        metrics.recentListings = recentListings;

        // Get listing creation trends (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const dailyTrends = await Listing.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        metrics.dailyTrends = dailyTrends;

        // Add metrics by category if applicable
        const categoryMetrics = await Listing.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        metrics.byCategory = categoryMetrics;

        res.status(200).json({
            success: true,
            data: metrics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching listing metrics'
        });
    }
});

module.exports = {
    getUserMetrics,
    getListingMetrics
};