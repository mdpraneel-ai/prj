const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const app = express();

// Middleware to read JSON data
app.use(express.json());
// Configure session
app.use(session({
    secret: process.env.SESSION_SECRET || "mySecretKey123",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport Local Strategy
require("./config/passport")(passport);

// Authentication routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Connect to MongoDB and start server
mongoose.connect("mongodb://127.0.0.1:27017/passportDB")
    .then(() => {
        console.log("Connected to MongoDB");

        app.listen(3000, () => {
            console.log("Server running at http://localhost:3000");
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });
