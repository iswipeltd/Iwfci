const { Highlight } = require('../models');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// List all highlights
exports.list = async (req, res) => {
  try {
    const highlights = await Highlight.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });

    res.render('admin/highlights/list', {
      title: 'Manage Highlights',
      highlights,
      username: req.session.username,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching highlights:', error);
    req.flash('error', 'Error loading highlights');
    res.redirect('/admin/dashboard');
  }
};

// Show create form
exports.showCreate = (req, res) => {
  res.render('admin/highlights/create', {
    title: 'Create Highlight',
    username: req.session.username,
    error: req.flash('error')
  });
};

// Create highlight
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect('/admin/highlights/create');
  }

  try {
    const { title, description, category, metric, percentage, year, additionalInfo, order, active } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    await Highlight.create({
      title,
      description,
      category,
      metric,
      percentage: percentage || 100,
      year,
      additionalInfo,
      image,
      order: order || 0,
      active: active === 'on'
    });

    req.flash('success', 'Highlight created successfully!');
    res.redirect('/admin/highlights');
  } catch (error) {
    console.error('Error creating highlight:', error);
    req.flash('error', 'Error creating highlight');
    res.redirect('/admin/highlights/create');
  }
};

// Show edit form
exports.showEdit = async (req, res) => {
  try {
    const highlight = await Highlight.findByPk(req.params.id);

    if (!highlight) {
      req.flash('error', 'Highlight not found');
      return res.redirect('/admin/highlights');
    }

    res.render('admin/highlights/edit', {
      title: 'Edit Highlight',
      highlight,
      username: req.session.username,
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching highlight:', error);
    req.flash('error', 'Error loading highlight');
    res.redirect('/admin/highlights');
  }
};

// Update highlight
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect(`/admin/highlights/edit/${req.params.id}`);
  }

  try {
    const highlight = await Highlight.findByPk(req.params.id);

    if (!highlight) {
      req.flash('error', 'Highlight not found');
      return res.redirect('/admin/highlights');
    }

    const { title, description, category, metric, percentage, year, additionalInfo, order, active } = req.body;

    // Handle image update
    let image = highlight.image;
    if (req.file) {
      // Delete old image if exists
      if (highlight.image) {
        const oldImagePath = path.join(__dirname, '../public', highlight.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    await highlight.update({
      title,
      description,
      category,
      metric,
      percentage: percentage || 100,
      year,
      additionalInfo,
      image,
      order: order || 0,
      active: active === 'on'
    });

    req.flash('success', 'Highlight updated successfully!');
    res.redirect('/admin/highlights');
  } catch (error) {
    console.error('Error updating highlight:', error);
    req.flash('error', 'Error updating highlight');
    res.redirect(`/admin/highlights/edit/${req.params.id}`);
  }
};

// Delete highlight
exports.delete = async (req, res) => {
  try {
    const highlight = await Highlight.findByPk(req.params.id);

    if (!highlight) {
      req.flash('error', 'Highlight not found');
      return res.redirect('/admin/highlights');
    }

    // Delete image if exists
    if (highlight.image) {
      const imagePath = path.join(__dirname, '../public', highlight.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await highlight.destroy();

    req.flash('success', 'Highlight deleted successfully!');
    res.redirect('/admin/highlights');
  } catch (error) {
    console.error('Error deleting highlight:', error);
    req.flash('error', 'Error deleting highlight');
    res.redirect('/admin/highlights');
  }
};
