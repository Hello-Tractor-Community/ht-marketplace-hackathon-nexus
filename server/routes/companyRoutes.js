// companyRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize, verifyCompany } = require('../middleware/auth');
const { checkOnboardingStatus } = require('../middleware/validation');

// router.use((req, res, next) => {
//     console.log(`Request Method: ${req.method}, Request Path: ${req.path}`);
//     next();
//   });
  
const { 
    registerCompany,
    getCompanyes,
    searchCompany,
    getCompanyById,
    updateCompanyProfile,
    deleteCompany
} = require('../controllers/companyController');

router.post('/register',  registerCompany);
// Public routes
router.get('/search', searchCompany);
router.get('/:id', getCompanyById);
router.get('/', getCompanyes);

// Protected routes
router.use(protect);

// Company owner routes
// router.post('/', authorize(['owner', 'founder', 'manager']), registerCompany);

router.put('/:id', verifyCompany, checkOnboardingStatus, (req, res, next) => {
    updateCompanyProfile(req, res, next);
});
// Admin only routes
router.delete('/:id', authorize('platform_admin'), deleteCompany);

module.exports = router;