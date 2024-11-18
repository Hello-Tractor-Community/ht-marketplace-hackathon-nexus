// utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (user, options = {}) => {
    // Base payload with essential user information
    const payload = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        platformRoles: user.platformRoles,
        isEmailVerified: user.security.emailVerified,
        accountStatus: user.accountStatus
    };

    // Add role-specific information based on platform roles
    if (user.platformRoles.includes('seller')) {
        // Include company associations for sellers
        payload.companyAssociations = user.companyAssociations.map(assoc => ({
            company: assoc.company,
            role: assoc.role,
            permissions: assoc.permissions,
            status: assoc.status
        }));
    }

    if (user.platformRoles.includes('admin')) {
        // Add admin-specific claims
        payload.isAdmin = true;
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