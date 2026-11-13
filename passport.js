const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/User");
module.exports = function(passport) {

    // Configure Local Strategy
    passport.use(
        new LocalStrategy(
            async (username, password, done) => {

                try {
                    // Find user in MongoDB
                    const user = await User.findOne({ username });
                    if (!user) {
                        return done(null, false, { message: "User not found"});
                    }
                    // Compare password with stored hash
                    const isMatch = await bcrypt.compare(password, user.passwordHash );
                    if (!isMatch) {
                        return done(null, false, { message: "Invalid password" });    
                    }

                    // Authentication successful
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // Store user ID in session
    passport.serializeUser((user, done) => { done(null, user.id);    });

        

    // Retrieve user using stored ID
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};
