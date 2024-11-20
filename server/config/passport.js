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
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/v1/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log("Google Strategy invoked. Profile received:", profile);
  
          // Check if user already exists
          console.log("Checking if user exists in the database...");
          let user = await User.findOne({
            'socialMediaAccounts.provider': 'google',
            'socialMediaAccounts.userId': profile.id,
          });
  
          if (!user) {
            console.log("No existing user found. Creating a new user...");

             // Generate a random placeholder password
            // const randomPassword = Math.random().toString(36).slice(-8);
  
            // Create a new user
            user = new User({
              firstName: profile.name?.givenName || "Unknown",
              lastName: profile.name?.familyName || "Unknown",
              email: profile.emails?.[0]?.value || `unknown-${profile.id}@google.com`,
            //   password: randomPassword,
              security: {
                emailVerified: true,
                emailVerifiedAt: new Date(),
              },
              socialMediaAccounts: [
                {
                  provider: 'google',
                  userId: profile.id,
                  accessToken,
                },
              ],
              platformRoles: ['buyer'], // Default role
              accountStatus: 'active',
            });
  
            console.log("Saving new user to the database...");
            await user.save();
            console.log("User successfully created!");
          } else {
            console.log("User already exists. Updating access token...");
  
            // Update access token if the user exists
            const socialAccount = user.socialMediaAccounts.find(
              (acc) => acc.provider === 'google'
            );
            if (socialAccount) {
              socialAccount.accessToken = accessToken;
            } else {
              console.log("Adding new social account to existing user...");
              user.socialMediaAccounts.push({
                provider: 'google',
                userId: profile.id,
                accessToken,
              });
            }
  
            console.log("Saving updated user information...");
            await user.save();
            console.log("User successfully updated!");
          }
  
          done(null, user); // Successful authentication
        } catch (error) {
          console.error("Error during Google authentication:", error);
  
          // Pass error details to the `done` callback
          done(
            new Error(
              `Google authentication failed: ${error.message || "Unknown error"}`
            ),
            null
          );
        }
      }
    )
  );
  

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