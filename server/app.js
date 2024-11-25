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
const passport = require('./config/passport');
const session = require('express-session');



// Performance Imports
const compression = require('compression');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const http = require('http');
const process = require('process');

// Utility Imports
const { Telegraf } = require('telegraf');
const { connectWithRetry, closeConnection } = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const companyRoutes = require('./routes/companyRoutes');
const listingRoutes = require('./routes/listingRoutes');
const companyOnboardingRoutes = require('./routes/companyOnboardingRoutes');
const userRoutes = require('./routes/userRoutes');
const imageProxyRoutes = require('./routes/imageProxyRoutes');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');
const messageRoutes = require('./routes/messageRoutes');

const dashboardRoutes = require('./routes/dashboardRoutes');

// Middleware Imports
const errorHandler = require('./middleware/errorHandler');
// const { protect } = require('./middleware/auth');

// Environment Configuration
const production = process.env.NODE_ENV === 'production';
const CLIENT_URL = production ? process.env.CLIENT_URL_PROD : process.env.CLIENT_URL_DEV;
const PORT = process.env.PORT || 5000;

// Initialize Express
const app = express();
const server = http.createServer(app);

// Security Middleware Configuration
const securityMiddleware = () => {

    // CORS Configuration
    app.use(cors({
        origin: CLIENT_URL,
        credentials: true
    }));


    app.use(helmet()); // Security headers
    app.use(mongoSanitize()); // Prevent NoSQL injections
    app.use(xss()); // Prevent XSS attacks
    app.use(hpp()); // Prevent HTTP Parameter Pollution




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



    // Passport Configuration
    app.use(passport.initialize());
    app.use(passport.session());
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
    app.use('/api/v1/dashboard', dashboardRoutes);
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/companys', companyRoutes);
    app.use('/api/v1/listings', listingRoutes);
    app.use('/api/v1/onboarding', companyOnboardingRoutes);
    app.use('/api/v1/images', imageProxyRoutes);
    app.use('/api/cloudinary', cloudinaryRoutes);
    

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
const connectMongoDB = () => {
    if (process.env.NODE_ENV !== 'test') {
        connectWithRetry();
    }
}

// Telegram Bot Configuration
// const configureTelegramBot = () => {
//     const bot = new Telegraf(process.env.BOT_TOKEN);

//     bot.start((ctx) => ctx.reply('Welcome to hello tractor commerce store!'));
//     bot.command('shop', (ctx) => {
//         ctx.reply('Hi! Please visit our shop: https://hello-tractor-commerce.onrender.com');
//     });

//     return bot;
// };
// Add a timeout to hanging requests
const TIMEOUT = 30000; // 30 seconds

// Uncaught Exception Handler
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Attempt graceful shutdown
    shutdown();
});

// Unhandled Promise Rejection Handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Attempt graceful shutdown
    shutdown();
});

// Server Startup Configuration
const startServer = () => {
    if (cluster.isMaster && production) {
        // Fork workers in production
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
            if (signal !== 'SIGTERM') {
                console.log('Starting a new worker...');
                cluster.fork(); // Replace the dead worker
            }
        });
    } else {
        // Initialize middleware
        securityMiddleware();
        parserMiddleware();
        staticFilesMiddleware();
        performanceMiddleware();

        // Add request timeout middleware
        app.use((req, res, next) => {
            res.setTimeout(TIMEOUT, () => {
                console.error('Request timeout: ', req.url);
                res.status(408).send('Request Timeout');
            });
            next();
        });

        // Configure routes
        configureRoutes();

        // Connect to MongoDB
        connectMongoDB();

        // Start server with error handling
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
        });

        server.on('error', (error) => {
            console.error('Server error:', error);
            if (error.code === 'EADDRINUSE') {
                console.log('Address in use, retrying...');
                setTimeout(() => {
                    server.close();
                    server.listen(PORT);
                }, 1000);
            }
        });

        
        // Monitor event loop lag 
        let lastLoop = Date.now();
        const LAG_THRESHOLD = process.env.NODE_ENV === 'production' ? 1000 : 5000; // 1s in prod, 5s in dev

        setInterval(() => {
            const now = Date.now();
            const lag = now - lastLoop;
            if (lag > LAG_THRESHOLD) {
                console.warn(`Significant event loop lag detected: ${lag}ms`);

                // Optional: Add some context about what might be happening
                const memoryUsage = process.memoryUsage();
                console.warn('Memory usage:', {
                    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
                    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
                    rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
                });
            }
            lastLoop = now;
        }, 1000);
    }
};

// Graceful shutdown function
const shutdown = () => {
    console.log('Initiating graceful shutdown...');

    // Stop accepting new requests
    server.close(() => {
        console.log('Server closed');

        // Close database connection
        closeConnection()
            .then(() => {
                console.log('Database connection closed');
                process.exit(1);
            })
            .catch((err) => {
                console.error('Error during database disconnection:', err);
                process.exit(1);
            });
    });

    // Force shutdown after 30 seconds if graceful shutdown fails
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
};

// Initialize server
startServer();

module.exports = app;