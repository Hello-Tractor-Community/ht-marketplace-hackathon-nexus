// app.js

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Security Imports
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const session = require('express-session');

// Performance Imports
const compression = require('compression');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

// Utility Imports
const { Telegraf } = require('telegraf');
const { connectWithRetry, closeConnection } = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const listingRoutes = require('./routes/listingRoutes');
const companyOnboardingRoutes = require('./routes/companyOnboardingRoutes');

// Middleware Imports
const errorHandler = require('./middleware/errorHandler');
const { protect } = require('./middleware/auth');

// Environment Configuration
const production = process.env.NODE_ENV === 'production';
const CLIENT_URL = production ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;
const PORT = process.env.PORT || 5000;

// Initialize Express
const app = express();

// Security Middleware Configuration
const securityMiddleware = () => {
    app.use(helmet()); // Security headers
    app.use(mongoSanitize()); // Prevent NoSQL injections
    app.use(xss()); // Prevent XSS attacks
    app.use(hpp()); // Prevent HTTP Parameter Pollution
    
    // CORS Configuration
    app.use(cors({
        origin: CLIENT_URL,
        credentials: true
    }));
    
    // Rate Limiting
    app.use('/api/', rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.'
    }));

    // Session Configuration
    app.use(session({
        secret: process.env.SESSION_SECRET || 'secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { 
            secure: production,
            httpOnly: true,
            sameSite: production ? 'strict' : 'lax'
        }
    }));
};

// Parser Middleware Configuration
const parserMiddleware = () => {
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true }));
};

// Static Files Configuration
const staticFilesMiddleware = () => {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
};

// Performance Middleware Configuration
const performanceMiddleware = () => {
    app.use(compression());
};

// API Routes Configuration
const configureRoutes = () => {
    // API Endpoints
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/company', companyRoutes);
    app.use('/api/v1/listings', listingRoutes);
    app.use('/api/v1/onboarding', companyOnboardingRoutes);

    // Base Routes
    app.get('/', (req, res) => {
        res.send('<h1>hello tractor commerce server</h1>');
    });

    // Catch-all route
    app.use('*', (req, res) => {
        res.redirect(`${CLIENT_URL}/*`);
    });

    // Error handling middleware
    app.use(errorHandler);
};

// Connect to MongoDB
const connectMongoDB = () =>{
      if (process.env.NODE_ENV !== 'test') {
        connectWithRetry();
    }
}

// Telegram Bot Configuration
const configureTelegramBot = () => {
    const bot = new Telegraf(process.env.BOT_TOKEN);
    
    bot.start((ctx) => ctx.reply('Welcome to hello tractor commerce store!'));
    bot.command('shop', (ctx) => {
        ctx.reply('Hi! Please visit our shop: https://hello-tractor-commerce.onrender.com');
    });
    
    return bot;
};

// Server Startup Configuration
const startServer = () => {
    if (cluster.isMaster && production) {
        // Fork workers in production
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died`);
            cluster.fork(); // Replace the dead worker
        });
    } else {
        // Initialize middleware
        securityMiddleware();
        parserMiddleware();
        staticFilesMiddleware();
        performanceMiddleware();
        
        // Configure routes
        configureRoutes();

        // Connect to MongoDB
        connectMongoDB();
        
        // Initialize Telegram bot
        const bot = configureTelegramBot();
        bot.launch();

        // Start server
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            closeConnection();
            process.exit(0);
        });
    }
};

// Initialize server
startServer();

module.exports = app;