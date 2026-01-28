const { Blog } = require('../models');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// List all blogs
exports.list = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.render('admin/blogs/list', {
      title: 'Manage Blogs',
      blogs,
      username: req.session.username,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    req.flash('error', 'Error loading blogs');
    res.redirect('/admin/dashboard');
  }
};

// Show create form
exports.showCreate = (req, res) => {
  res.render('admin/blogs/create', {
    title: 'Create Blog Post',
    username: req.session.username,
    error: req.flash('error')
  });
};

// Create blog
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect('/admin/blogs/create');
  }

  try {
    const { title, content, excerpt, author, published } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    await Blog.create({
      title,
      content,
      excerpt,
      author,
      image,
      published: published === 'on'
    });

    req.flash('success', 'Blog post created successfully!');
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Error creating blog:', error);
    req.flash('error', 'Error creating blog post');
    res.redirect('/admin/blogs/create');
  }
};

// Show edit form
exports.showEdit = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      req.flash('error', 'Blog post not found');
      return res.redirect('/admin/blogs');
    }

    res.render('admin/blogs/edit', {
      title: 'Edit Blog Post',
      blog,
      username: req.session.username,
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    req.flash('error', 'Error loading blog post');
    res.redirect('/admin/blogs');
  }
};

// Update blog
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect(`/admin/blogs/edit/${req.params.id}`);
  }

  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      req.flash('error', 'Blog post not found');
      return res.redirect('/admin/blogs');
    }

    const { title, content, excerpt, author, published } = req.body;

    // Handle image update
    let image = blog.image;
    if (req.file) {
      // Delete old image if exists
      if (blog.image) {
        const oldImagePath = path.join(__dirname, '../public', blog.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    await blog.update({
      title,
      content,
      excerpt,
      author,
      image,
      published: published === 'on'
    });

    req.flash('success', 'Blog post updated successfully!');
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Error updating blog:', error);
    req.flash('error', 'Error updating blog post');
    res.redirect(`/admin/blogs/edit/${req.params.id}`);
  }
};

// Delete blog
exports.delete = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      req.flash('error', 'Blog post not found');
      return res.redirect('/admin/blogs');
    }

    // Delete image if exists
    if (blog.image) {
      const imagePath = path.join(__dirname, '../public', blog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await blog.destroy();

    req.flash('success', 'Blog post deleted successfully!');
    res.redirect('/admin/blogs');
  } catch (error) {
    console.error('Error deleting blog:', error);
    req.flash('error', 'Error deleting blog post');
    res.redirect('/admin/blogs');
  }
};
