const express = require('express');
const router = express.Router();
const cloudinaryController = require('../controllers/cloudinaryController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/signature', cloudinaryController.getUploadSignature);
router.post('/upload', upload.single('file'), cloudinaryController.uploadImage);

module.exports = router;