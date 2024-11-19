const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter-oauth2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists
        let user = await User.findOne({
            'socialMediaAccounts.provider': 'google',
            'socialMediaAccounts.userId': profile.id
        });

        if (!user) {
            // Create new user
            user = new User({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                security: {
                    emailVerified: true,
                    emailVerifiedAt: new Date()
                },
                socialMediaAccounts: [{
                    provider: 'google',
                    userId: profile.id,
                    accessToken
                }],
                platformRoles: ['buyer'], // default role
                accountStatus: 'active'
            });
            await user.save();
        } else {
            // Update access token
            const socialAccount = user.socialMediaAccounts.find(acc => acc.provider === 'google');
            if (socialAccount) {
                socialAccount.accessToken = accessToken;
                await user.save();
            }
        }
        
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/api/v1/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({
            'socialMediaAccounts.provider': 'facebook',
            'socialMediaAccounts.userId': profile.id
        });

        if (!user) {
            user = new User({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                security: {
                    emailVerified: true,
                    emailVerifiedAt: new Date()
                },
                socialMediaAccounts: [{
                    provider: 'facebook',
                    userId: profile.id,
                    accessToken
                }],
                platformRoles: ['buyer'],
                accountStatus: 'active'
            });
            await user.save();
        } else {
            const socialAccount = user.socialMediaAccounts.find(acc => acc.provider === 'facebook');
            if (socialAccount) {
                socialAccount.accessToken = accessToken;
                await user.save();
            }
        }
        
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}));

module.exports = passport;