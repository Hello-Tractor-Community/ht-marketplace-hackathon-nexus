// controllers/companyController.js
const Company = require('../models/Company');
const mongoose = require('mongoose');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');
const path = require('path');


const registerCompany = async (req, res) => {
    console.log("Registering company..");
    try {
        console.log("request body..", req.body);
        const { owner, role, companyName, companyType, registrationDetails, location } = req.body;

        // Check if the owner is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(owner)) {
            console.log("request owner type..", typeof owner);
            res.status(400).json({ error: 'Invalid owner ID' });
            return;
        }

        // Create the new company
        console.log("Creating new company...");
        const company = await Company.create({
            owner: new mongoose.Types.ObjectId(owner),
            companyName,
            companyType,
            registrationDetails,
            location
        });

        if (company) {
            console.log("Company registered successfully!");
        } else {
            console.log("Company registration not successful.");
        }

        console.log("role..", role);
        // Set default permissions based on role
        let permissions = [];
        if (role.toLowerCase() === 'owner' || role.toLowerCase() === 'founder') {
            permissions = [
                'manage_products',
                'manage_orders',
                'manage_staff',
                'view_analytics',
                'manage_settings'
            ];
        } else if (role.toLowerCase() === 'manager') {
            permissions = [
                'manage_products',
                'manage_orders',
                'view_analytics'
            ];
        }

        // Associate the user with the new company
        console.log("Associating user with the company...");
        const user = await User.findById(new mongoose.Types.ObjectId(owner));
        if (!user) {
            console.log("User not found.");
            res.status(404).json({ error: 'User not found' });
            return;
        } else {
            console.log("User found for association..", user);
        }

        user.CompanyAssociations.push({
            company: company._id,
            role: role.toLowerCase(),
            permissions: permissions,
            status: 'active',
            joinedAt: Date.now()
        });
        await user.save();

        console.log("User association created successfully!");

        // Generate verification token for email verification
        const verificationToken = user.getVerificationToken();
        console.log('verification token: ', verificationToken);
        await user.save();

        console.log("host..",req.get('host'));

        // Send verification email
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify/${verificationToken}`;
        await sendEmail({
            email: user.email,
            subject: 'Email Verification',
            message: `Please verify your email by clicking: ${verificationUrl}`
        });

        res.status(201).json({
            success: true,
            data: {user, company}
        });
    } catch (error) {
        console.error("Error registering company:", error);
        res.status(500).json({ error: error.message });
    }
};

const getCompanyes = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Add filter options
    const filter = {};
    if (req.query.companyType) filter.companyType = req.query.companyType;
    if (req.query.productCategories) {
        filter.productCategories = { $in: req.query.productCategories.split(',') };
    }

    const [companyes, total] = await Promise.all([
        Company.find(filter)
            .populate({
                path: 'owner',
                select: 'firstName lastName email'
            })
            .skip(skip)
            .limit(limit)
            .lean(),
        Company.countDocuments(filter)
    ]);

    res.status(200).json({
        success: true,
        data: companyes,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

const searchCompany = asyncHandler(async (req, res) => {
    const { q, companyType, location, radius } = req.query;
    const query = {};

    // Text search
    if (q) {
        query.$or = [
            { companyName: { $regex: q, $options: 'i' } },
            { workDescription: { $regex: q, $options: 'i' } }
        ];
    }

    // Company type filter
    if (companyType) {
        query.companyType = companyType;
    }

    // Geo-spatial search
    if (location && radius) {
        const [longitude, latitude] = location.split(',').map(Number);
        query['location.coordinates'] = {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance: parseInt(radius) * 1000 // Convert km to meters
            }
        };
    }

    const companyes = await Company.find(query)
        .populate({
            path: 'owner',
            select: 'firstName lastName email'
        })
        .limit(20);

    res.status(200).json({
        success: true,
        count: companyes.length,
        data: companyes
    });
});

const getCompanyById = asyncHandler(async (req, res) => {
    console.log("Inside getCompanyId..")
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid company ID');
    }

    const company = await Company.findById(req.params.id)
        .populate({
            path: 'owner',
            select: 'firstName lastName email'
        });

    if (!company) {
        res.status(404);
        throw new Error('Company not found');
    }

    res.status(200).json({
        success: true,
        data: company
    });
});

const updateCompanyProfile = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid company ID');
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
        res.status(404);
        throw new Error('Company not found');
    }

    // Check ownership
    if (company.owner.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this company');
    }

    // Prevent companyName update if it already exists
    if (req.body.companyName && req.body.companyName !== company.companyName) {
        const companyExists = await Company.findOne({ companyName: req.body.companyName });
        if (companyExists) {
            res.status(400);
            throw new Error('Company name already exists');
        }
    }

    const updatedCompany = await Company.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: updatedCompany
    });
});

const deleteCompany = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid company ID');
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
        res.status(404);
        throw new Error('Company not found');
    }

    // Check ownership
    if (company.owner.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this company');
    }

    await Company.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Company removed successfully'
    });
});

module.exports = {
    registerCompany,
    getCompanyes,
    searchCompany,
    getCompanyById,
    updateCompanyProfile,
    deleteCompany
};

