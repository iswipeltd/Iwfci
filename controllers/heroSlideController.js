const { HeroSlide } = require('../models');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// List all hero slides
exports.list = async (req, res) => {
  try {
    const slides = await HeroSlide.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });

    res.render('admin/hero-slides/list', {
      title: 'Manage Hero Carousel',
      slides,
      username: req.session.username,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    req.flash('error', 'Error loading hero slides');
    res.redirect('/admin/dashboard');
  }
};

// Show create form
exports.showCreate = (req, res) => {
  res.render('admin/hero-slides/create', {
    title: 'Create Hero Slide',
    username: req.session.username,
    error: req.flash('error')
  });
};

// Create hero slide
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect('/admin/hero-slides/create');
  }

  try {
    const { title, subtitle, description, buttonText, buttonLink, order, active } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image) {
      req.flash('error', 'Image is required for hero slide');
      return res.redirect('/admin/hero-slides/create');
    }

    await HeroSlide.create({
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      image,
      order: order || 0,
      active: active === 'on'
    });

    req.flash('success', 'Hero slide created successfully!');
    res.redirect('/admin/hero-slides');
  } catch (error) {
    console.error('Error creating hero slide:', error);
    req.flash('error', 'Error creating hero slide');
    res.redirect('/admin/hero-slides/create');
  }
};

// Show edit form
exports.showEdit = async (req, res) => {
  try {
    const slide = await HeroSlide.findByPk(req.params.id);

    if (!slide) {
      req.flash('error', 'Hero slide not found');
      return res.redirect('/admin/hero-slides');
    }

    res.render('admin/hero-slides/edit', {
      title: 'Edit Hero Slide',
      slide,
      username: req.session.username,
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    req.flash('error', 'Error loading hero slide');
    res.redirect('/admin/hero-slides');
  }
};

// Update hero slide
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect(`/admin/hero-slides/edit/${req.params.id}`);
  }

  try {
    const slide = await HeroSlide.findByPk(req.params.id);

    if (!slide) {
      req.flash('error', 'Hero slide not found');
      return res.redirect('/admin/hero-slides');
    }

    const { title, subtitle, description, buttonText, buttonLink, order, active } = req.body;

    // Handle image update
    let image = slide.image;
    if (req.file) {
      // Delete old image if exists
      if (slide.image) {
        const oldImagePath = path.join(__dirname, '../public', slide.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    await slide.update({
      title,
      subtitle,
      description,
      buttonText,
      buttonLink,
      image,
      order: order || 0,
      active: active === 'on'
    });

    req.flash('success', 'Hero slide updated successfully!');
    res.redirect('/admin/hero-slides');
  } catch (error) {
    console.error('Error updating hero slide:', error);
    req.flash('error', 'Error updating hero slide');
    res.redirect(`/admin/hero-slides/edit/${req.params.id}`);
  }
};

// Delete hero slide
exports.delete = async (req, res) => {
  try {
    const slide = await HeroSlide.findByPk(req.params.id);

    if (!slide) {
      req.flash('error', 'Hero slide not found');
      return res.redirect('/admin/hero-slides');
    }

    // Delete image if exists
    if (slide.image) {
      const imagePath = path.join(__dirname, '../public', slide.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await slide.destroy();

    req.flash('success', 'Hero slide deleted successfully!');
    res.redirect('/admin/hero-slides');
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    req.flash('error', 'Error deleting hero slide');
    res.redirect('/admin/hero-slides');
  }
};
