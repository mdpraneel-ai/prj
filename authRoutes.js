const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

// REGISTER API
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            passwordHash
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});

// LOGIN API using Passport Local Strategy
router.post("/login", (req, res, next) => {

    passport.authenticate("local", (err, user, info) => {

        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({
                message: info.message
            });
        }

        req.logIn(user, (err) => {

            if (err) {
                return next(err);
            }

            res.status(200).json({
                message: "Login successful",
                username: user.username
            });
        });

    })(req, res, next);
});

// PROTECTED ROUTE
router.get("/profile", (req, res) => {

    if (!req.isAuthenticated()) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    res.status(200).json({
        message: "Welcome to your profile",
        username: req.user.username
    });
});

// LOGOUT API
router.post("/logout", (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }
        res.status(200).json({message: "Logout successful" });
    });
});
module.exports = router;
