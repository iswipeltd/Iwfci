const { Admin } = require('../models');
const { validationResult } = require('express-validator');

// Show login page
exports.showLogin = (req, res) => {
  res.render('admin/login', {
    title: 'Admin Login',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

// Handle login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect('/admin/login');
  }

  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { username } });

    if (!admin) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/admin/login');
    }

    const isValidPassword = await admin.validPassword(password);

    if (!isValidPassword) {
      req.flash('error', 'Invalid username or password');
      return res.redirect('/admin/login');
    }

    // Set session
    req.session.adminId = admin.id;
    req.session.username = admin.username;

    req.flash('success', 'Login successful!');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/admin/login');
  }
};

// Handle logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/admin/login');
  });
};

// Show dashboard
exports.dashboard = async (req, res) => {
  try {
    const { Event, Blog, Contact, HeroSlide, Highlight, BoardMember } = require('../models');
    
    const eventsCount = await Event.count();
    const blogsCount = await Blog.count();
    const contactsCount = await Contact.count({ where: { status: 'new' } });
    const heroSlidesCount = await HeroSlide.count({ where: { active: true } });
    const highlightsCount = await Highlight.count({ where: { active: true } });
    const boardMembersCount = await BoardMember.count({ where: { active: true } });

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      username: req.session.username,
      eventsCount,
      blogsCount,
      contactsCount,
      heroSlidesCount,
      highlightsCount,
      boardMembersCount,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/admin/login');
  }
};
