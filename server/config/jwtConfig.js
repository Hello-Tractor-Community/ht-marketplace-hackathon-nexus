// config/jwtConfig.js
require('dotenv').config();

const jwtConfig = {
    secret: process.env.JWT_SECRET || '',
    expiresIn: '30d',
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
};

// Middleware for extracting JWT from different sources (headers, cookies, etc)
const extractJWT = (req) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        return req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        return req.cookies.token;
    }
    return null;
};

module.exports = { jwtConfig, extractJWT };