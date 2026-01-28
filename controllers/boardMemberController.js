const { BoardMember } = require('../models');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// List all board members
exports.list = async (req, res) => {
  try {
    const members = await BoardMember.findAll({
      order: [['order', 'ASC'], ['createdAt', 'DESC']]
    });

    res.render('admin/board-members/list', {
      title: 'Manage Board Members',
      members,
      username: req.session.username,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching board members:', error);
    req.flash('error', 'Error loading board members');
    res.redirect('/admin/dashboard');
  }
};

// Show create form
exports.showCreate = (req, res) => {
  res.render('admin/board-members/create', {
    title: 'Add Board Member',
    username: req.session.username,
    error: req.flash('error')
  });
};

// Create board member
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect('/admin/board-members/create');
  }

  try {
    const { name, position, bio, company, email, phone, facebook, twitter, linkedin, instagram, order, featured, active } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    await BoardMember.create({
      name,
      position,
      bio,
      company,
      email,
      phone,
      facebook,
      twitter,
      linkedin,
      instagram,
      image,
      order: order || 0,
      featured: featured === 'on',
      active: active === 'on'
    });

    req.flash('success', 'Board member added successfully!');
    res.redirect('/admin/board-members');
  } catch (error) {
    console.error('Error creating board member:', error);
    req.flash('error', 'Error adding board member');
    res.redirect('/admin/board-members/create');
  }
};

// Show edit form
exports.showEdit = async (req, res) => {
  try {
    const member = await BoardMember.findByPk(req.params.id);

    if (!member) {
      req.flash('error', 'Board member not found');
      return res.redirect('/admin/board-members');
    }

    res.render('admin/board-members/edit', {
      title: 'Edit Board Member',
      member,
      username: req.session.username,
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching board member:', error);
    req.flash('error', 'Error loading board member');
    res.redirect('/admin/board-members');
  }
};

// Update board member
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect(`/admin/board-members/edit/${req.params.id}`);
  }

  try {
    const member = await BoardMember.findByPk(req.params.id);

    if (!member) {
      req.flash('error', 'Board member not found');
      return res.redirect('/admin/board-members');
    }

    const { name, position, bio, company, email, phone, facebook, twitter, linkedin, instagram, order, featured, active } = req.body;

    // Handle image update
    let image = member.image;
    if (req.file) {
      // Delete old image if exists
      if (member.image) {
        const oldImagePath = path.join(__dirname, '../public', member.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    await member.update({
      name,
      position,
      bio,
      company,
      email,
      phone,
      facebook,
      twitter,
      linkedin,
      instagram,
      image,
      order: order || 0,
      featured: featured === 'on',
      active: active === 'on'
    });

    req.flash('success', 'Board member updated successfully!');
    res.redirect('/admin/board-members');
  } catch (error) {
    console.error('Error updating board member:', error);
    req.flash('error', 'Error updating board member');
    res.redirect(`/admin/board-members/edit/${req.params.id}`);
  }
};

// Delete board member
exports.delete = async (req, res) => {
  try {
    const member = await BoardMember.findByPk(req.params.id);

    if (!member) {
      req.flash('error', 'Board member not found');
      return res.redirect('/admin/board-members');
    }

    // Delete image if exists
    if (member.image) {
      const imagePath = path.join(__dirname, '../public', member.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await member.destroy();

    req.flash('success', 'Board member deleted successfully!');
    res.redirect('/admin/board-members');
  } catch (error) {
    console.error('Error deleting board member:', error);
    req.flash('error', 'Error deleting board member');
    res.redirect('/admin/board-members');
  }
};
