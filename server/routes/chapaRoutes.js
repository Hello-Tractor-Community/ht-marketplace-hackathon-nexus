const express = require('express');
const router = express.Router();
const chapaController = require('../controllers/chapaController');

// Initialize transaction
router.post('/initialize', chapaController.initializeTransaction);

// Initiate payment and redirect to Chapa's hosted checkout page
router.post('/pay', chapaController.initiatePayment);

// Verify transaction
// router.get('/verify/:txRef', chapaController.verifyTransaction);

// Create subaccount
router.post('/subaccount', chapaController.createSubaccount);

router.all('/orderConfirmation', chapaController.orderConfirmation);

router.post('/webhook', chapaController.webHook);

router.get('/verify-transaction/:txRef', chapaController.verifyTransaction);

// Add this new route
router.all('/status', chapaController.handlePaymentStatus);

module.exports = router;