const express = require('express');
const router = express.Router();
const { protect, authorize, verifyCompany } = require('../middleware/auth');
const { validateCompanyDocuments } = require('../middleware/validation');
const {
    startOnboarding,
    updatePortfolio,
    uploadDocuments,
    updateOnboardingPolicies,
    reviewOnboarding,
    completeOnboarding
} = require('../controllers/companyOnboardingController');

// All routes require authentication
router.use(protect);

// Company routes (requires artisan role)
router.use(authorize('artisan'));
router.post('/start', startOnboarding);

// Verified company routes
router.use(verifyCompany);
router.put('/portfolio', updatePortfolio);
router.put('/documents', validateCompanyDocuments, uploadDocuments);
router.put('/policies', updateOnboardingPolicies);
router.put('/:id/review', authorize('platform_admin'), reviewOnboarding);
router.post('/complete', completeOnboarding);

module.exports = router;