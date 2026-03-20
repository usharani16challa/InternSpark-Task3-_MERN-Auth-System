const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// We import the User model to attach the user object to the request
const User = mongoose.model('User'); 

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the token exists in the cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2. If no token, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'You are not logged in. Please log in to gain access.',
    });
  }

  try {
    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Check if the user still exists in the database
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return res.status(401).json({
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // 5. GRANT ACCESS: Attach user to the request object (req.user)
    // This allows subsequent route handlers to know WHO is making the request
    req.user = currentUser;
    next(); 
  } catch (err) {
    // If token is expired or invalid
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

module.exports = { protect };