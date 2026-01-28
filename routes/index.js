const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const eventController = require('../controllers/eventController');
const blogController = require('../controllers/blogController');
const contactController = require('../controllers/contactController');
const heroSlideController = require('../controllers/heroSlideController');
const highlightController = require('../controllers/highlightController');
const boardMemberController = require('../controllers/boardMemberController');

const { isAuthenticated, isNotAuthenticated } = require('../middleware/auth');
const upload = require('../config/multer');

// ========== Public Routes ==========
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Contact form routes
router.get('/contact', contactController.showForm);
router.post('/contact', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], contactController.submit);

// ========== Admin Authentication Routes ==========
router.get('/admin/login', isNotAuthenticated, authController.showLogin);
router.post('/admin/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], authController.login);

router.get('/admin/logout', isAuthenticated, authController.logout);

// ========== Admin Dashboard ==========
router.get('/admin/dashboard', isAuthenticated, authController.dashboard);

// ========== Admin Events Routes ==========
router.get('/admin/events', isAuthenticated, eventController.list);
router.get('/admin/events/create', isAuthenticated, eventController.showCreate);
router.post('/admin/events/create', isAuthenticated, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('eventDate').notEmpty().withMessage('Event date is required')
], eventController.create);
router.get('/admin/events/edit/:id', isAuthenticated, eventController.showEdit);
router.post('/admin/events/edit/:id', isAuthenticated, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('eventDate').notEmpty().withMessage('Event date is required')
], eventController.update);
router.post('/admin/events/delete/:id', isAuthenticated, eventController.delete);

// ========== Admin Blogs Routes ==========
router.get('/admin/blogs', isAuthenticated, blogController.list);
router.get('/admin/blogs/create', isAuthenticated, blogController.showCreate);
router.post('/admin/blogs/create', isAuthenticated, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('author').trim().notEmpty().withMessage('Author is required')
], blogController.create);
router.get('/admin/blogs/edit/:id', isAuthenticated, blogController.showEdit);
router.post('/admin/blogs/edit/:id', isAuthenticated, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('author').trim().notEmpty().withMessage('Author is required')
], blogController.update);
router.post('/admin/blogs/delete/:id', isAuthenticated, blogController.delete);

// ========== Admin Contacts Routes ==========
router.get('/admin/contacts', isAuthenticated, contactController.adminList);
router.get('/admin/contacts/view/:id', isAuthenticated, contactController.adminView);
router.post('/admin/contacts/delete/:id', isAuthenticated, contactController.adminDelete);

// ========== Admin Hero Slides Routes ==========
router.get('/admin/hero-slides', isAuthenticated, heroSlideController.list);
router.get('/admin/hero-slides/create', isAuthenticated, heroSlideController.showCreate);
router.post('/admin/hero-slides/create', isAuthenticated, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('order').optional().isInt().withMessage('Order must be a number')
], heroSlideController.create);
router.get('/admin/hero-slides/edit/:id', isAuthenticated, heroSlideController.showEdit);
router.post('/admin/hero-slides/edit/:id', isAuthenticated, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('order').optional().isInt().withMessage('Order must be a number')
], heroSlideController.update);
router.post('/admin/hero-slides/delete/:id', isAuthenticated, heroSlideController.delete);

// ========== Admin Highlights Routes ==========
router.get('/admin/highlights', isAuthenticated, highlightController.list);
router.get('/admin/highlights/create', isAuthenticated, highlightController.showCreate);
router.post('/admin/highlights/create', isAuthenticated, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('percentage').optional().isInt({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100')
], highlightController.create);
router.get('/admin/highlights/edit/:id', isAuthenticated, highlightController.showEdit);
router.post('/admin/highlights/edit/:id', isAuthenticated, upload.single('image'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('percentage').optional().isInt({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100')
], highlightController.update);
router.post('/admin/highlights/delete/:id', isAuthenticated, highlightController.delete);

// ========== Admin Board Members Routes ==========
router.get('/admin/board-members', isAuthenticated, boardMemberController.list);
router.get('/admin/board-members/create', isAuthenticated, boardMemberController.showCreate);
router.post('/admin/board-members/create', isAuthenticated, upload.single('image'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], boardMemberController.create);
router.get('/admin/board-members/edit/:id', isAuthenticated, boardMemberController.showEdit);
router.post('/admin/board-members/edit/:id', isAuthenticated, upload.single('image'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], boardMemberController.update);
router.post('/admin/board-members/delete/:id', isAuthenticated, boardMemberController.delete);

module.exports = router;
