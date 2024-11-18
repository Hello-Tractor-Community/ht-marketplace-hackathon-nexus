// models/OperatorOnboarding.js
const mongoose = require('mongoose');

const operatorOnboardingSchema = new mongoose.Schema({
    operator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operator',
        required: true
    },
    status: {
        type: String,
        enum: [
            'initial_registration',
            'email_verification',
            'document_submission',
            'profile_completion',
            'review_pending',
            'completed',
            'rejected'
        ],
        default: 'initial_registration'
    },
    completedSteps: {
        initialRegistration: {
            type: Boolean,
            default: false
        },
        emailVerification: {
            type: Boolean,
            default: false
        },
        documentSubmission: {
            type: Boolean,
            default: false
        },
        profileCompletion: {
            type: Boolean,
            default: false
        }
    },
    verificationDetails: {
        emailVerified: {
            type: Boolean,
            default: false
        },
        emailVerificationDate: Date,
        phoneVerified: {
            type: Boolean,
            default: false
        },
        phoneVerificationDate: Date,
        documentsVerified: {
            type: Boolean,
            default: false
        },
        documentsVerificationDate: Date
    },
    documents: [{
        type: {
            type: String,
            required: true,
            enum: [
                'tax_id',
                'skill_certification',
                'identity_proof',
                'address_proof',
                'portfolio',
                'other'
            ]
        },
        name: String,
        fileUrl: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        verificationStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending'
        },
        verificationNotes: String
    }],
    portfolio: [{
        title: String,
        description: String,
        imageUrls: [String],
        category: String,
        operatorTechniques: [String],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
  
    operatorCompliance: {
        hasInsurance: Boolean,
        insuranceDetails: String,
        certifications: [{
            name: String,
            issuingAuthority: String,
            validUntil: Date,
            documentUrl: String
        }],
        taxComplianceVerified: Boolean
    },
    reviewNotes: [{
        note: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ['internal', 'operator_visible'],
            default: 'internal'
        }
    }],
    submissionDates: {
        initialRegistration: Date,
        emailVerification: Date,
        documentSubmission: Date,
        profileCompletion: Date,
        reviewStarted: Date,
        completed: Date
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejectionReasons: [{
        reason: String,
        details: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Middleware to update submission dates
operatorOnboardingSchema.pre('save', function(next) {
    if (this.isModified('status')) {
        const now = Date.now();
        switch (this.status) {
            case 'initial_registration':
                this.submissionDates.initialRegistration = now;
                break;
            case 'email_verification':
                this.submissionDates.emailVerification = now;
                break;
            case 'document_submission':
                this.submissionDates.documentSubmission = now;
                break;
            case 'profile_completion':
                this.submissionDates.profileCompletion = now;
                break;
            case 'review_pending':
                this.submissionDates.reviewStarted = now;
                break;
            case 'completed':
                this.submissionDates.completed = now;
                break;
        }
    }
    next();
});

module.exports = mongoose.model('OperatorOnboarding', operatorOnboardingSchema);