require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const methodOverride = require('method-override');
const db = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true
  }
}));

// Flash messages
app.use(flash());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1>');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('<h1>500 - Internal Server Error</h1>');
});

// Database sync and server start
db.sequelize.sync()
  .then(() => {
    console.log('✓ Database connected successfully');
    
    // Create default admin if none exists
    return db.Admin.findOne();
  })
  .then(async (admin) => {
    if (!admin) {
      console.log('Creating default admin user...');
      await db.Admin.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123'
      });
      console.log('✓ Default admin created (username: admin, password: admin123)');
      console.log('⚠ Please change the default password after first login!');
    }
    
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Admin panel: http://localhost:${PORT}/admin/login`);
      console.log(`✓ Contact form: http://localhost:${PORT}/contact`);
    });
  })
  .catch((err) => {
    console.error('✗ Unable to connect to the database:', err);
    process.exit(1);
  });
