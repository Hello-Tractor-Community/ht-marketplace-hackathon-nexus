//authController.js

// controllers/authController.js

const { generateToken, generateRefreshToken, generateTempToken } = require('../utils/generateToken');

const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Verify email
// @route   GET /api/v1/auth/verify/:token
// @access  Public

const CLIENT_URL = process.env.NODE_ENV === 'development' ? process.env.CLIENT_URL_DEV : process.env.CLIENT_URL_PROD;

const verifyEmail = asyncHandler(async (req, res, next) => {
    console.log("Verifying Email..");
    console.log("token..", req.params.token);
    const verificationToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        verificationToken,
        verificationTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid or expired verification token', 400));
    }
    console.log("Verify email.. user found..", user);

    // Update the email verification status in the `security` field
    user.security.emailVerified = true;
    user.security.emailVerifiedAt = new Date();
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save();

    // Redirect to the frontend EmailVerificationPage
    const token = generateToken(user._id);
    console.log("Verify email..new token..", token);
    res.redirect(`${CLIENT_URL}/email-confirmation?token=${token}`);
});



// @desc    Check email verification status
// @route   GET /api/v1/auth/check-verification
// @access  Private
// Check verification endpoint
// const checkVerification = asyncHandler(async (req, res, next) => {

//     console.log("Inside checkVerification request..", req);
//     // console.log("Inside checkVerification user ID..",req.user.id);
//     const user = await User.findById(req.user.id);

//     if (!user) {
//         console.log('User not found in checkVerification');
//         return next(new ErrorResponse('User not found', 404));
//     }

//     console.log('Checking verification for user:', user._id, 'Email verified:', user.isEmailVerified);

//     res.status(200).json({
//         success: true,
//         isVerified: user.security.emailVerified
//     });

//     console.log('Sent verification response:', { success: true, isVerified: user.isEmailVerified });
// });

const checkVerification = asyncHandler(async (req, res, next) => {
    console.log("Inside checkVerification backend..");

    // Fetch user and populate associated fields
    const user = await User.findById(req.user._id)
        .select('-password')
        .populate({
            path: 'companyAssociations.company',
            model: 'Company',
            select: 'companyName companyType registrationStatus'
        })
        .populate({
            path: 'operatorDetails',
            model: 'Operator',
            select: 'certifications yearsOfExperience primarySkills rating available location'
        });

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    // Check if email is verified in the security object
    const isVerified = user.security.emailVerified;
    const verifiedAt = user.security.emailVerifiedAt;

    // Get the most recent company association
    const latestCompany = user.companyAssociations[user.companyAssociations.length - 1];

    // Get all company associations with their status
    const companyAssociations = user.companyAssociations.map(assoc => ({
        company: assoc.company._id,
        role: assoc.role,
        status: assoc.status,
        permissions: assoc.permissions
    }));

    // Get operator details if the user has the operator role
    let operatorDetails = null;
    if (user.platformRoles.includes('operator') && user.operatorDetails) {
        operatorDetails = {
            id: user.operatorDetails._id,
            certifications: user.operatorDetails.certifications,
            yaersOfExperience: user.operatorDetails.yaersOfExperience,
            rating: user.operatorDetails.rating,
            available: user.operatorDetails.available,
            location: user.operatorDetails.location
        };
    }

    // Prepare response data
    const data = {
        isVerified,
        verifiedAt,
        companyDetails: latestCompany ? {
            companyId: latestCompany.company._id,
            companyName: latestCompany.company.companyName,
            role: latestCompany.role
        } : null,
        user: {
            _id: user._id,
            companyAssociations,
            platformRoles: user.platformRoles,
            operatorDetails // Include operator details if present
        }
    };

    console.log("checkVerification data..", data);
    console.log("checkVerification companyAssociations..", companyAssociations);

    res.status(200).json({
        success: true,
        data
    });
});





// @desc    Resend verification email
// @route   POST /api/v1/auth/verify/resend
// @access  Private


const resendVerification = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    if (user.isEmailVerified) {
        return next(new ErrorResponse('Email already verified', 400));
    }

    // Generate new verification token
    const verificationToken = user.getVerificationToken();
    await user.save();

    // Create verification url
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify/${verificationToken}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Email Verification - Resend',
            message: `Please verify your email by clicking: ${verificationUrl}`
        });

        res.status(200).json({
            success: true,
            message: 'Verification email resent successfully'
        });
    } catch (err) {
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save();

        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

const registerUser = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, phone, password, roles } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        return next(new ErrorResponse('User already exists', 400));
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        platformRoles: roles,
        companyAssociations: [],
        operatorDetails: {}
    });

    if (user) {
        console.log("User created successfully.");
        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            data: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    platformRoles: user.platformRoles
                },
                token
            }
        });
    } else {
        return next(new ErrorResponse('Failed to create user', 500));
    }
});

// Add company association to user
const addCompanyAssociation = async (req, res) => {
    try {
        const { userId, companyId, role } = req.body;

        // Validate role against enum
        if (!['owner', 'founder', 'manager', 'agent'].includes(role)) {
            return res.status(400).json({
                error: 'Invalid role. Must be owner, founder, or manager'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Set default permissions based on role
        let permissions = [];
        if (role === 'owner' || role === 'founder') {
            permissions = [
                'manage_products',
                'manage_orders',
                'manage_staff',
                'view_analytics',
                'manage_settings'
            ];
        } else if (role === 'manager' || role === 'agent') {
            permissions = [
                'manage_products',
                'manage_orders',
                'view_analytics'
            ];
        }

        // Add company association
        user.companyAssociations.push({
            company: companyId,
            role: role,
            permissions: permissions,
            status: 'active',
            joinedAt: Date.now()
        });

        await user.save();

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addOperatorDetails = async (req, res) => {
    try {
        const { userId, certifications, yearsOfExperience, primarySkills, rating, location } = req.body;

        // Validate experience
        if (!Number.isInteger(yearsOfExperience) || yearsOfExperience < 0) {
            return res.status(400).json({ error: 'yearsOfExperience must be a non-negative integer.' });
        }

        // Validate certifications
        if (!Array.isArray(certifications) || certifications.some(cert => typeof cert !== 'string')) {
            return res.status(400).json({ error: 'Certifications must be an array of strings.' });
        }

        // Validate location
        if (
            !location ||
            typeof location.type !== 'string' ||
            location.type !== 'Point' ||
            !Array.isArray(location.coordinates) ||
            location.coordinates.length !== 2 ||
            location.coordinates.some(coord => typeof coord !== 'number')
        ) {
            return res.status(400).json({ error: 'Invalid location. Must be a GeoJSON Point with valid coordinates.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user has the 'operator' role
        if (!user.platformRoles.includes('operator')) {
            return res.status(400).json({ error: 'User does not have the operator role.' });
        }

        // Create operator details
        const operatorDetails = await Operator.create({
            userId,
            certifications,
            yearsOfExperience,
            primarySkills,
            rating: rating || 0, // Default to 0 if not provided
            location,
            available: true
        });

        // Associate the operator details with the user
        user.operatorDetails = operatorDetails._id;
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                user,
                operatorDetails
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const loginUser = async (req, res) => {
    console.log("Login request received.")
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            console.log("User found.")
            const token = generateToken(user._id);
            // Get the most recent company association
            const latestCompany = user.companyAssociations[user.companyAssociations.length - 1];

            // Get all company associations with their status
            const companyAssociations = user.companyAssociations.map(assoc => ({
                company: assoc.company._id,
                role: assoc.role,
                status: assoc.status,
                permissions: assoc.permissions
            }));

            // Get operator details if the user has the operator role
            let operatorDetails = null;
            if (user.platformRoles.includes('operator') && user.operatorDetails) {
                operatorDetails = {
                    id: user.operatorDetails._id,
                    certifications: user.operatorDetails.certifications,
                    yaersOfExperience: user.operatorDetails.yaersOfExperience,
                    rating: user.operatorDetails.rating,
                    available: user.operatorDetails.available,
                    location: user.operatorDetails.location
                };
            }
            res.json({
                success: true,
                data: {
                    companyDetails: latestCompany ? {
                        companyId: latestCompany.company._id,
                        companyName: latestCompany.company.companyName,
                        role: latestCompany.role
                    } : null,
                    user: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        security: user.security,
                        platformRoles: user.platformRoles,
                        companyAssociations,
                        operatorDetails
                    },
                    token
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logoutUser = asyncHandler(async (req, res, next) => {
    // Note: Since we're using JWT tokens, we don't need to invalidate the token server-side
    // The client should remove the token from storage
    console.log("Logout request received.");

    res.status(200).json({
        success: true,
        message: 'Successfully logged out'
    });
});

// Define the missing functions
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add exports
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    verifyEmail,
    resendVerification,
    checkVerification,
    addCompanyAssociation,
    addOperatorDetails
};