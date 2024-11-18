// middleware/validation.js
const asyncHandler = require('../middleware/async');
const validateCompanyDocuments = (req, res, next) => {
    if (!req.files) {
        return next(new ErrorResponse('Please upload required documents', 400));
    }

    const files = req.files;
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const requiredDocuments = [
        'company_registration',
        'tax_id',
        'craft_certification',
        'identity_proof'
    ];
    const maxSize = process.env.MAX_FILE_SIZE || 5000000; // 5MB default

    // Check for required documents
    const uploadedDocTypes = Object.keys(files);
    const missingDocs = requiredDocuments.filter(doc => !uploadedDocTypes.includes(doc));

    if (missingDocs.length > 0) {
        return next(
            new ErrorResponse(
                `Missing required documents: ${missingDocs.join(', ')}`,
                400
            )
        );
    }

    // Validate each file
    for (const key in files) {
        const file = files[key];

        // Check file type
        if (!allowedTypes.includes(file.mimetype)) {
            return next(
                new ErrorResponse(
                    `${key}: Please upload files in PDF, JPEG, or PNG format only`,
                    400
                )
            );
        }

        // Check file size
        if (file.size > maxSize) {
            return next(
                new ErrorResponse(
                    `${key}: File size cannot exceed ${maxSize / 1000000}MB`,
                    400
                )
            );
        }

        // Check for empty files
        if (file.size === 0) {
            return next(
                new ErrorResponse(
                    `${key}: Empty files are not allowed`,
                    400
                )
            );
        }
    }

    next();
};

const checkOnboardingStatus = asyncHandler(async (req, res, next) => {
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

module.exports = { 
    validateCompanyDocuments,
    checkOnboardingStatus
};