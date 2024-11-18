// utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (user, options = {}) => {
    // Base payload with essential user information
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: options.isVerified || user.isEmailVerified,
        accountStatus: user.accountStatus
    };

    // Add role-specific information
    switch (user.role) {
        case 'artisan':
            // Include only IDs for reference - full objects would make token too large
            if (user.craftProfile) {
                payload.craftProfile = {
                    _id: user.craftProfile._id,
                    primaryCraftSkill: user.craftProfile.primaryCraftSkill
                };
            }
            
            if (user.businessProfile) {
                payload.business = {
                    _id: user.businessProfile._id,
                    businessName: user.businessProfile.businessName,
                    businessType: user.businessProfile.businessType,
                    isVerified: user.businessProfile.registrationDetails?.isVerified
                };
            }
            break;

        case 'shop_admin':
            if (user.businessProfile) {
                payload.business = {
                    _id: user.businessProfile._id,
                    businessName: user.businessProfile.businessName,
                    isVerified: user.businessProfile.registrationDetails?.isVerified
                };
            }
            break;

        case 'platform_admin':
            // Add any platform-admin specific claims
            payload.adminLevel = 'platform';
            break;

        case 'customer':
            // Add any customer-specific claims if needed
            break;
    }

    // Add any custom claims from options
    if (options.additionalClaims) {
        payload.customClaims = options.additionalClaims;
    }

    return jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-default-secret-key',
        {
            expiresIn: options.expiresIn || '30d',
            issuer: 'craft-marketplace',
            audience: options.audience || 'web'
        }
    );
};

// Generate refresh token with longer expiration
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            tokenVersion: user.tokenVersion || 0,
            role: user.role
        },
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        {
            expiresIn: '90d',
            issuer: 'craft-marketplace'
        }
    );
};

// Generate temporary token for verification purposes
const generateTempToken = (user, purpose, expiresIn = '1h') => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            purpose: purpose
        },
        process.env.JWT_TEMP_SECRET || 'your-temp-secret-key',
        {
            expiresIn,
            issuer: 'craft-marketplace'
        }
    );
};

module.exports = {
    generateToken,
    generateRefreshToken,
    generateTempToken
};