const express = require('express');
const imageProxyController = require('../controllers/imageProxyController');
const router = express.Router();

router.get('/images/:imageUrl', imageProxyController.getImage);

module.exports = router;