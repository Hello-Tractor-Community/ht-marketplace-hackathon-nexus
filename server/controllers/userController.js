// controllers/companyController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json({
        success: true,
        data: users
    });
});


const getUser = asyncHandler(async (req, res) => {
    console.log("Inside getUser..");
    console.log("req.params.id: ", req.params.id);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid User ID');
    }

    const user = await User.findById(req.params.id)
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    console.log("user: ", user);
    
    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            comapanyAssociations: user.companyAssociations,
            platformRoles: user.platformRoles,
            lastLogin: user.lastLogin

        }
    });
});

const getUsersByRole = asyncHandler(async (req, res) => {
    const { role } = req.query;
    
    if (!role) {
        res.status(400);
        throw new Error('Role parameter is required');
    }

    const users = await User.find({ platformRoles: role })
        .select('firstName lastName email phone accountStatus platformRoles companyAssociations');
    
    res.status(200).json({
        success: true,
        data: users
    });
});


// controllers/userController.js

const createUser = asyncHandler(async (req, res) => {
    // Extract user data from request body
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        platformRoles,
        address,
        companyAssociations
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User with this email already exists');
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Create user with admin-provided data
    // Force these security and status settings for admin-created users
    const userData = {
        firstName,
        lastName,
        email,
        password,
        phone,
        platformRoles: platformRoles || ['buyer'],
        address,
        companyAssociations,
        accountStatus: 'active', // Always set to active
        security: {
            emailVerified: true,
            emailVerifiedAt: new Date()
        }
    };

    // Explicitly override any status or security fields that might have been sent
    delete req.body.accountStatus;
    delete req.body.security;

    const user = await User.create(userData);

    if (user) {
        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                platformRoles: user.platformRoles,
                companyAssociations: user.companyAssociations,
                accountStatus: user.accountStatus
            }
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// Update currently updates firstName and lastName
const updateUserProfile = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid User ID');
    }
    
    const user = await User.findById(req.params.id).select(['firstName', 'lastName']);
    
    if (!user) {
        res.status(404);
        throw new Error('Company not found');
    }
    
    console.log("user: ", user)
    
    console.log('body: ', req.body)
    
    const updated_user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
    );
    
    res.status(200).json({
        success: true,
        data: updated_user
    });
});

// Enhanced deleteUser controller
const deleteUser = asyncHandler(async (req, res) => {
    console.log('Delete controller reached');
    const { id } = req.params;
    
    // Log authentication info
    console.log('User attempting delete:', {
        requestingUserId: req.user?._id,
        userRole: req.user?.role,
        targetUserId: id
    });

    // Validate the provided ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Invalid User ID provided:', id);
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid User ID' 
        });
    }
    
    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
        console.log('User not found:', id);
        return res.status(404).json({ 
            success: false, 
            message: 'User not found' 
        });
    }
    
    try {
        // Delete the user
        await user.deleteOne();
        console.log('User successfully deleted:', id);
        
        res.status(200).json({
            success: true,
            message: 'User removed successfully',
        });
    } catch (error) {
        console.error('Error during user deletion:', error);
        throw error;
    }
});


const updateUserStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { accountStatus } = req.body;
    
    
    // Validate the status value
    const validStatuses = ['pending', 'active', 'suspended', 'deactivated'];
    if (!validStatuses.includes(accountStatus)) {
        res.status(400);
        throw new Error('Invalid account status value');
    }

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid User ID');
    }

    // Find and update the user
    const user = await User.findById(id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update the status
    user.accountStatus = accountStatus;
    await user.save();

    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            accountStatus: user.accountStatus
        }
    });
});


const searchUser = asyncHandler(async (req, res) => {
    console.log("I am in the search user")
    const { firstName, lastName } = req.query;
    console.log("firstName: ", firstName, " lastName: ",lastName)
    const query = {};

    // Search firstName
    if (firstName) {
        query.firstName = { $regex: firstName, $options: 'i' }
    }

    // Search lastName
    if (lastName) {
        query.lastName = { $regex: lastName, $options: 'i' }
    }

    const users = await User.find(query)

    res.status(200).json({
        success: true,
        data: users
    });
});

module.exports = {
    updateUserStatus,
    deleteUser,
    searchUser,
    updateUserProfile,
    getAllUsers,
    getUser,
    createUser,
    getUsersByRole
};

