const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// 1. IMPORT MODEL (Make sure this file exists in server/models/User.js)
const User = require('./models/User');

const app = express();

// 2. MIDDLEWARE (The order here is very important)
app.use(express.json()); // Fixes the "500 error" by parsing incoming data
app.use(cookieParser());
app.use(cors({ 
    origin: 'http://localhost:3000', 
    credentials: true 
}));

// 3. SIGNUP ROUTE
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user (Password hashing happens in User.js pre-save hook)
    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup Error:", err); // Look at your terminal for this!
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// 4. LOGIN ROUTE
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send Token in httpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Set to true only if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({ user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});

// 5. PROTECTED ROUTE (To verify session on page refresh)
app.get('/api/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid session" });
  }
});

// 6. LOGOUT ROUTE
app.post('/api/logout', (req, res) => {
  res.clearCookie('token').json({ message: "Logged out" });
});

// 7. DATABASE CONNECTION & SERVER START
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB Connection Error:", err));