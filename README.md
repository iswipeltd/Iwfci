A complete Node.js backend application with admin panel for managing events, blogs, and contact enquiries.

## Features

✅ **Admin Authentication**
- Secure login/logout
- Password hashing with bcrypt
- Session-based authentication

✅ **Event Management (CRUD)**
- Create, read, update, delete events
- Image upload support
- Publish/unpublish functionality
- Event date and location management

✅ **Blog Management (CRUD)**
- Create, read, update, delete blog posts
- Rich content with excerpts
- Author attribution
- Featured images
- Publish/unpublish functionality

✅ **Contact Form**
- Public contact form
- Automatic email notification to parent account
- Contact enquiry management in admin panel
- Status tracking (new, read, replied)

✅ **Additional Features**
- Responsive design
- Flash messages for user feedback
- File upload with validation
- Image handling for events and blogs

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **View Engine**: EJS
- **Authentication**: bcryptjs, express-session
- **Email**: Nodemailer
- **File Upload**: Multer
- **Validation**: express-validator

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. **Clone or extract the project**
   ```bash
   cd school-admin-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   
   - Edit `.env` with your settings:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=school_admin
   DB_DIALECT=mysql

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Session Secret (change this to a random string)
   SESSION_SECRET=your_very_long_random_secret_key_here

   # Email Configuration (Gmail example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password
   PARENT_EMAIL=parent@example.com
   ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE school_admin;
   ```

5. **Initialize the database**
   ```bash
   node init-db.js
   ```
   
   This will:
   - Create all database tables
   - Create a default admin user
   - Add sample data

## Email Configuration

### Using Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use this app password in the `.env` file as `EMAIL_PASSWORD`

### Using Other Providers:

Update these values in `.env`:
- `EMAIL_HOST`: Your SMTP host
- `EMAIL_PORT`: SMTP port (usually 587 or 465)
- `EMAIL_SECURE`: true for port 465, false for other ports
- `EMAIL_USER`: Your email address
- `EMAIL_PASSWORD`: Your email password

## Usage

### Start the server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

### Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Important**: Change the default password after first login!

## Application Routes

### Public Routes
- `GET /` - Home page
- `GET /contact` - Contact form
- `POST /contact` - Submit contact form

### Admin Routes
- `GET /admin/login` - Admin login page
- `POST /admin/login` - Process login
- `GET /admin/logout` - Logout
- `GET /admin/dashboard` - Admin dashboard

### Events Management
- `GET /admin/events` - List all events
- `GET /admin/events/create` - Create event form
- `POST /admin/events/create` - Save new event
- `GET /admin/events/edit/:id` - Edit event form
- `POST /admin/events/edit/:id` - Update event
- `POST /admin/events/delete/:id` - Delete event

### Blogs Management
- `GET /admin/blogs` - List all blogs
- `GET /admin/blogs/create` - Create blog form
- `POST /admin/blogs/create` - Save new blog
- `GET /admin/blogs/edit/:id` - Edit blog form
- `POST /admin/blogs/edit/:id` - Update blog
- `POST /admin/blogs/delete/:id` - Delete blog

### Contacts Management
- `GET /admin/contacts` - List all contacts
- `GET /admin/contacts/view/:id` - View contact details
- `POST /admin/contacts/delete/:id` - Delete contact

## Project Structure

```
school-admin-system/
├── config/
│   ├── database.js       # Database configuration
│   └── multer.js         # File upload configuration
├── controllers/
│   ├── authController.js # Authentication logic
│   ├── blogController.js # Blog CRUD operations
│   ├── contactController.js # Contact form handling
│   └── eventController.js # Event CRUD operations
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/
│   ├── Admin.js          # Admin model
│   ├── Blog.js           # Blog model
│   ├── Contact.js        # Contact model
│   ├── Event.js          # Event model
│   └── index.js          # Models index
├── public/
│   └── uploads/          # Uploaded images
├── routes/
│   └── index.js          # Application routes
├── utils/
│   └── email.js          # Email utilities
├── views/
│   ├── admin/            # Admin panel views
│   │   ├── blogs/        # Blog views
│   │   ├── contacts/     # Contact views
│   │   ├── events/       # Event views
│   │   ├── dashboard.ejs
│   │   └── login.ejs
│   ├── contact.ejs       # Public contact form
│   └── index.ejs         # Home page
├── .env.example          # Environment variables template
├── init-db.js            # Database initialization script
├── package.json          # Dependencies
├── README.md             # This file
└── server.js             # Main application file
```

## Database Schema

### Admins Table
- id (Primary Key)
- username (Unique)
- email (Unique)
- password (Hashed)
- createdAt
- updatedAt

### Events Table
- id (Primary Key)
- title
- description
- eventDate
- location
- image
- published (Boolean)
- createdAt
- updatedAt

### Blogs Table
- id (Primary Key)
- title
- content
- excerpt
- author
- image
- published (Boolean)
- createdAt
- updatedAt

### Contacts Table
- id (Primary Key)
- name
- email
- phone
- subject
- message
- status (new/read/replied)
- createdAt
- updatedAt

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Protected admin routes
- SQL injection prevention (Sequelize)
- File upload validation
- XSS prevention

## Development Tips

### Adding New Admin Users

You can add new admin users programmatically:

```javascript
const { Admin } = require('./models');

Admin.create({
  username: 'newadmin',
  email: 'newadmin@example.com',
  password: 'securepassword'
});
```

### Resetting Database

To reset the database completely:

```bash
node init-db.js
```

⚠️ Warning: This will delete all existing data!

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### Email Not Sending
- Check email credentials in `.env`
- For Gmail, ensure app password is used (not regular password)
- Check SMTP settings

### File Upload Issues
- Ensure `public/uploads` directory exists and is writable
- Check file size limits (default: 5MB)
- Verify allowed file types

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please check:
1. This README file
2. Environment configuration (`.env`)
3. Server logs for error messages

## Future Enhancements

Potential features to add:
- User roles and permissions
- Email templates
- Rich text editor for blogs
- Image gallery
- Search functionality
- Export data to CSV/PDF
- API endpoints for mobile app
- Social media integration
- Analytics dashboard
