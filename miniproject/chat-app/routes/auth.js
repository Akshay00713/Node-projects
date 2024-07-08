// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET: Display the login form
router.get('/login', (req, res) => {
  res.render('login', { error: null }); // Pass a default error value
});

// POST: Handle login logic
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      req.session.username = user.username;
      return res.redirect('/chat');
    } else {
      // Invalid credentials
      res.render('login', { error: 'Invalid username or password' });
    }
  } catch (error) {
    // Server error or unexpected error
    res.render('login', { error: 'An error occurred during login' });
  }
});

// GET: Display the signup form
router.get('/signup', (req, res) => {
  res.render('signup', { error: null }); // Pass a default error value
});

// POST: Handle signup logic
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUser) {
      // Username already exists
      return res.render('signup', { error: 'Username already exists' });
    }
    if (existingEmail) {
      // Email already exists
      return res.render('signup', { error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect('/chat');
  } catch (error) {
    // Server error or unexpected error
    res.render('signup', { error: 'An error occurred during signup' });
  }
});

router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if(error) {
            return res.render('/chat');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
});

module.exports = router;
