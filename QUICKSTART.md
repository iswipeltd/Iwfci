# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your settings (minimum required):
   ```env
   DB_PASSWORD=your_mysql_password
   SESSION_SECRET=any_random_long_string
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password
   PARENT_EMAIL=where_to_receive_contacts@example.com
   ```

### Step 3: Create Database
```sql
CREATE DATABASE admin;
```

### Step 4: Initialize Database
```bash
node init-db.js
```

### Step 5: Start the Server
```bash
npm start
```

### Step 6: Login to Admin Panel
1. Open browser: `http://localhost:3000/admin/login`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. **Change your password immediately!**

## 📧 Setting Up Gmail for Contact Form

1. Enable 2-Step Verification on your Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an app password for "Mail"
4. Use this 16-character password in your `.env` file as `EMAIL_PASSWORD`

## 🎯 What You Can Do

### Admin Panel Features:
- ✅ Create and manage events
- ✅ Create and manage blog posts
- ✅ View contact enquiries
- ✅ Upload images for events/blogs
- ✅ Publish/unpublish content

### Public Features:
- ✅ Contact form (sends email to parent account)
- ✅ View home page

## 🔧 Common Issues

**Can't connect to database?**
- Make sure MySQL is running
- Check your database credentials in `.env`
- Ensure the database `school_admin` exists

**Email not sending?**
- Use Gmail app password (not regular password)
- Check email settings in `.env`
- Make sure 2FA is enabled on Google account

**Port 3000 already in use?**
- Change `PORT=3000` to another port in `.env`

## 📝 Next Steps

1. Change the default admin password
2. Add your school's information
3. Create your first event
4. Write your first blog post
5. Test the contact form

## 🆘 Need Help?

Check the main `README.md` file for detailed documentation!
