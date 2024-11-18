// generateSecret.js
const crypto = require('crypto');

// Generate a random string of 64 characters
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('Your JWT Secret:', jwtSecret);

// Generate multiple options
console.log('\nAlternative secrets:');
console.log('Base64:', crypto.randomBytes(32).toString('base64'));
console.log('URLSafe Base64:', crypto.randomBytes(32).toString('base64url'));