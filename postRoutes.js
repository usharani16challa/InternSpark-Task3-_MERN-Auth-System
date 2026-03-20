const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Public route - anyone can see posts
router.get('/all-posts', (req, res) => { ... });

// Protected route - only logged-in users can create posts
// The 'protect' function runs BEFORE the controller
router.post('/create-post', protect, (req, res) => {
    // Thanks to the middleware, we now have access to req.user
    console.log("Creating post for user:", req.user.email);
    res.send("Post created!");
});

module.exports = router;