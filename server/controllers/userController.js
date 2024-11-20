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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid User ID');
    }

    const user = await User.findById(req.params.id)
    
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    res.status(200).json({
        success: true,
        data: user
    });
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

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Validate the provided ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'Invalid User ID' });
    }
    
    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Delete the user (triggers cascading delete if configured in schema)
    await user.deleteOne();
    
    res.status(200).json({
        success: true,
        message: 'User removed successfully',
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
    deleteUser,
    searchUser,
    updateUserProfile,
    getAllUsers,
    getUser
};

