const Company = require('../models/Company');
const User = require('../models/User');
const CompanyOnboarding = require('../models/CompanyOnboarding');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const path = require('path');

// @desc    Start company onboarding process
// @route   POST /api/v1/company-onboarding/start
// @access  Public
exports.startOnboarding = asyncHandler(async (req, res, next) => {
    const {
        companyName,
        firstName,
        lastName,
        email,
        phone,
        password,
        position
    } = req.body;

    // Create or fetch company
    const company = await Company.findOne({ name: companyName }) || 
                    await Company.create({ name: companyName });

    // Create owner user account
    const user = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        position,
        role: 'company',
        company: company._id
    });

    // Create onboarding record
    const onboarding = await CompanyOnboarding.create({
        company: company._id,
        owner: user._id,
        status: 'draft'
    });

    // Generate verification token
    const verificationToken = user.getVerificationToken();
    await user.save();

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify/${verificationToken}`;
    await sendEmail({
        email: user.email,
        subject: 'Company Email Verification',
        message: `Please verify your email by clicking: ${verificationUrl}`
    });

    res.status(201).json({
        success: true,
        data: onboarding
    });
});

// @desc    Update portfolio and craft expertise
// @route   PUT /api/v1/company-onboarding/portfolio
// @access  Private (Company)
exports.updatePortfolio = asyncHandler(async (req, res, next) => {
    const { portfolio, qualityAssurance } = req.body;

    const onboarding = await CompanyOnboarding.findOne({
        owner: req.user.id
    });

    if (!onboarding) {
        return next(new ErrorResponse('Onboarding record not found', 404));
    }

    if (portfolio) {
        onboarding.portfolio = portfolio;
        onboarding.completedSteps.portfolioUploaded = true;
    }

    if (qualityAssurance) {
        onboarding.qualityAssurance = qualityAssurance;
    }

    await onboarding.save();

    res.status(200).json({
        success: true,
        data: onboarding
    });
});

// @desc    Submit company documents
// @route   PUT /api/v1/company-onboarding/documents
// @access  Private (Company)
exports.uploadDocuments = asyncHandler(async (req, res, next) => {
    const onboarding = await CompanyOnboarding.findOne({
        owner: req.user.id
    });

    if (!onboarding) {
        return next(new ErrorResponse('Onboarding record not found', 404));
    }

    if (!req.files) {
        return next(new ErrorResponse('Please upload files', 400));
    }

    const files = req.files;
    const documents = [];

    for (const key in files) {
        const file = files[key];
        
        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
            return next(new ErrorResponse('Please upload only PDF, JPEG, or PNG files', 400));
        }

        if (file.size > process.env.MAX_FILE_SIZE) {
            return next(new ErrorResponse('File size too large', 400));
        }

        const filename = `doc_${onboarding.company}_${Date.now()}${path.parse(file.name).ext}`;
        const uploadPath = path.join(process.env.FILE_UPLOAD_PATH, filename);
        await file.mv(uploadPath);

        documents.push({
            type: key,
            name: file.name,
            fileUrl: path.join(process.env.FILE_UPLOAD_PATH, filename),
            uploadedAt: Date.now(),
            verificationStatus: 'pending'
        });
    }

    onboarding.documents = documents;
    onboarding.status = 'documents_submitted';
    onboarding.completedSteps.documentsSubmitted = true;
    await onboarding.save();

    res.status(200).json({
        success: true,
        data: onboarding
    });
});

// @desc    Update company policies
// @route   PUT /api/v1/company-onboarding/policies
// @access  Private (Company)
exports.updateOnboardingPolicies = asyncHandler(async (req, res, next) => {
    const { policies } = req.body;

    const onboarding = await CompanyOnboarding.findOne({
        owner: req.user.id
    });

    if (!onboarding) {
        return next(new ErrorResponse('Onboarding record not found', 404));
    }

    onboarding.policies = policies;
    onboarding.completedSteps.policiesAgreed = true;
    
    if (Object.values(onboarding.completedSteps).every(step => step)) {
        onboarding.status = 'under_review';
    }

    await onboarding.save();

    res.status(200).json({
        success: true,
        data: onboarding
    });
});

// @desc    Review company onboarding
// @route   PUT /api/v1/company-onboarding/:id/review
// @access  Private (Admin)
exports.reviewOnboarding = asyncHandler(async (req, res, next) => {
    const { status, note, noteType } = req.body;
    
    const onboarding = await CompanyOnboarding.findById(req.params.id);

    if (!onboarding) {
        return next(new ErrorResponse('Onboarding record not found', 404));
    }

    onboarding.status = status;
    onboarding.reviewedBy = req.user.id;

    if (note) {
        onboarding.reviewNotes.push({
            note,
            createdBy: req.user.id,
            type: noteType || 'internal'
        });
    }

    if (status === 'approved') {
        // Update company verified status
        await Company.findByIdAndUpdate(onboarding.company, {
            verified: true,
            active: true
        });

        // Send approval email
        const company = await Company.findById(onboarding.company);
        const owner = await User.findById(onboarding.owner);
        
        await sendEmail({
            email: owner.email,
            subject: 'Company Account Approved',
            message: `Congratulations! ${company.name} has been approved as a company.`
        });
    }

    await onboarding.save();

    res.status(200).json({
        success: true,
        data: onboarding
    });
});

// @desc    Complete company onboarding process
// @route   POST /api/v1/company-onboarding/complete
// @access  Private (Company)
exports.completeOnboarding = asyncHandler(async (req, res, next) => {
    const onboarding = await CompanyOnboarding.findOne({
        owner: req.user.id
    });

    if (!onboarding) {
        return next(new ErrorResponse('Onboarding record not found', 404));
    }

    onboarding.status = 'completed';
    onboarding.completedAt = Date.now();

    // Update company status
    const company = await Company.findById(onboarding.company);
    company.verified = true;
    company.active = true;
    await company.save();

    // Send completion email
    const owner = await User.findById(onboarding.owner);
    await sendEmail({
        email: owner.email,
        subject: 'Company Onboarding Completed',
        message: `Congratulations! Your company "${company.name}" has been successfully onboarded.`
    });

    await onboarding.save();

    res.status(200).json({
        success: true,
        data: onboarding
    });
});

// @desc    Check company onboarding status
exports.checkOnboardingStatus = asyncHandler(async (req, res, next) => {
    try {
        const onboarding = await CompanyOnboarding.findOne({ 
            owner: req.user._id 
        });

        if (!onboarding) {
            return res.status(404).json({
                success: false,
                error: 'Company onboarding profile not found'
            });
        }

        if (onboarding.status === 'rejected') {
            return res.status(403).json({
                success: false,
                error: 'Your company application has been rejected. Please contact support.'
            });
        }

        if (onboarding.status !== 'approved') {
            return res.status(403).json({
                success: false,
                error: 'Please complete the company onboarding process'
            });
        }

        next();
    } catch (error) {
        next(error);
    }
});