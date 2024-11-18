// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please add a first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 8,
        select: false
    },
    phone: {
        number: String,
        verified: {
            type: Boolean,
            default: false
        },
        verifiedAt: Date
    },

    address: {
        city: String,
        state: String,
        country: String,
    },

    profileImage: { type: String }, // URL from Cloudinary
    
    // Platform-level roles
    platformRoles: [{
        type: String,
        enum: ['buyer', 'seller', 'admin', 'dealer', 'operator'],
        default: ['buyer']
    }],
    
    // Company associations 
    companyAssociations: [{
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        role: {
            type: String,
            enum: ['owner', 'founder', 'manager', 'agent'],
            required: true
        },
        permissions: [{
            type: String,
            enum: [
                'manage_products',
                'manage_orders',
                'manage_staff',
                'view_analytics',
                'manage_settings'
            ]
        }],
        status: {
            type: String,
            enum: ['active', 'inactive', 'pending'],
            default: 'active'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }], 

    socialMediaAccounts: [{
    provider: {
        type: String,
        enum: ['google', 'facebook', 'x']
    },
    userId: String,
    accessToken: String
    }],
    
    preferences: {
        communicationMethod: {
            type: String,
            enum: ['Email', 'Phone', 'Both'],
            default: 'Email'
        },
        availability: {
            type: String,
            enum: ['Weekdays', 'Weekends', 'Anytime', 'Limited']
        },
        notifications: {
            email: {
                marketing: Boolean,
                orders: Boolean,
                system: Boolean
            },
            sms: {
                marketing: Boolean,
                orders: Boolean,
                system: Boolean
            }
        }
    },
    
    security: {
        emailVerified: {
            type: Boolean,
            default: false
        },
        emailVerifiedAt: Date,
        lastPasswordChange: Date,
        twoFactorEnabled: {
            type: Boolean,
            default: false
        },
        twoFactorMethod: {
            type: String,
            enum: ['email', 'sms', 'authenticator']
        }
    },
    
    accountStatus: {
        type: String,
        enum: ['pending', 'active', 'suspended', 'deactivated'],
        default: 'pending'
    },
    
    lastLogin: Date,
    loginHistory: [{
        date: Date,
        ip: String,
        device: String,
        location: String
    }],
    verificationToken: String,
    verificationTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date
}, {
    timestamps: true
});

// Add helper methods for role checking
userSchema.methods = {
    // Check if user has specific platform role
    hasPlatformRole(role) {
        return this.platformRoles.includes(role);
    },

    // Check if user has company role for specific company
    hasCompanyRole(companyId, role) {
        const association = this.companyAssociations.find(
            assoc => assoc.company.toString() === companyId.toString()
        );
        return association && association.role === role;
    },

    // Check if user has specific permission for a company
    hasCompanyPermission(companyId, permission) {
        const association = this.companyAssociations.find(
            assoc => assoc.company.toString() === companyId.toString()
        );
        return association && association.permissions.includes(permission);
    },

    // Get all company roles
    getCompanyRoles() {
        return this.companyAssociations.map(assoc => ({
            company: assoc.company,
            role: assoc.role
        }));
    }
};

// Encrypt password middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getVerificationToken = function() {
    // Generate token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to verificationToken field
    this.verificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    // Set expire
    this.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    return verificationToken;
};

// Password comparison method
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);