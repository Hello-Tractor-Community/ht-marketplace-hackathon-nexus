const CraftProfile = require('../models/CraftProfile');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create or update craft profile
// @route   POST /api/v1/craft-profile
// @access  Private
exports.createUpdateProfile = asyncHandler(async (req, res, next) => {
    // Basic validation
    if (!req.body.primaryCraftSkill) {
        return next(new ErrorResponse('Primary craft skill is required', 400));
    }

    let profile = await CraftProfile.findOne({ user: req.user.id });

    if (profile) {
        // Update existing profile
        profile = await CraftProfile.findOneAndUpdate(
            { user: req.user.id },
            req.body,
            { new: true, runValidators: true }
        );
    } else {
        // Create new profile
        profile = await CraftProfile.create({
            user: req.user.id,
            ...req.body
        });
    }

    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Get craft profile
// @route   GET /api/v1/craft-profile/:id
// @access  Public
exports.getProfile = asyncHandler(async (req, res, next) => {
    const profile = await CraftProfile.findById(req.params.id)
        .populate('user', 'firstName lastName email');

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Add certification to profile
// @route   POST /api/v1/craft-profile/certifications
// @access  Private
exports.addCertification = asyncHandler(async (req, res, next) => {
    const profile = await CraftProfile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    profile.certifications.push(req.body);
    await profile.save();

    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Add portfolio item
// @route   POST /api/v1/craft-profile/portfolio
// @access  Private
exports.addPortfolioItem = asyncHandler(async (req, res, next) => {
    const profile = await CraftProfile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    // Handle file uploads here if needed
    profile.portfolio.push(req.body);
    await profile.save();

    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Remove portfolio item
// @route   DELETE /api/v1/craft-profile/portfolio/:itemId
// @access  Private
exports.removePortfolioItem = asyncHandler(async (req, res, next) => {
    const profile = await CraftProfile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    profile.portfolio = profile.portfolio.filter(
        item => item._id.toString() !== req.params.itemId
    );

    await profile.save();

    res.status(200).json({
        success: true,
        data: profile
    });
});

// @desc    Search craft profiles
// @route   GET /api/v1/craft-profile/search
// @access  Public
exports.searchProfiles = asyncHandler(async (req, res, next) => {
    const {
        primaryCraftSkill,
        specializations,
        yearsOfExperience
    } = req.query;

    const query = {};

    if (primaryCraftSkill) {
        query.primaryCraftSkill = primaryCraftSkill;
    }

    if (specializations) {
        query.specializations = { $in: specializations.split(',') };
    }

    if (yearsOfExperience) {
        query.yearsOfExperience = { $gte: parseInt(yearsOfExperience) };
    }

    const profiles = await CraftProfile.find(query)
        .populate('user', 'firstName lastName email');

    res.status(200).json({
        success: true,
        count: profiles.length,
        data: profiles
    });
});