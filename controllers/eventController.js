const { Event } = require('../models');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// List all events
exports.list = async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['eventDate', 'DESC']]
    });

    res.render('admin/events/list', {
      title: 'Manage Events',
      events,
      username: req.session.username,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    req.flash('error', 'Error loading events');
    res.redirect('/admin/dashboard');
  }
};

// Show create form
exports.showCreate = (req, res) => {
  res.render('admin/events/create', {
    title: 'Create Event',
    username: req.session.username,
    error: req.flash('error')
  });
};

// Create event
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect('/admin/events/create');
  }

  try {
    const { title, description, eventDate, location, published } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    await Event.create({
      title,
      description,
      eventDate,
      location,
      image,
      published: published === 'on'
    });

    req.flash('success', 'Event created successfully!');
    res.redirect('/admin/events');
  } catch (error) {
    console.error('Error creating event:', error);
    req.flash('error', 'Error creating event');
    res.redirect('/admin/events/create');
  }
};

// Show edit form
exports.showEdit = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/admin/events');
    }

    res.render('admin/events/edit', {
      title: 'Edit Event',
      event,
      username: req.session.username,
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    req.flash('error', 'Error loading event');
    res.redirect('/admin/events');
  }
};

// Update event
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect(`/admin/events/edit/${req.params.id}`);
  }

  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/admin/events');
    }

    const { title, description, eventDate, location, published } = req.body;

    // Handle image update
    let image = event.image;
    if (req.file) {
      // Delete old image if exists
      if (event.image) {
        const oldImagePath = path.join(__dirname, '../public', event.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    await event.update({
      title,
      description,
      eventDate,
      location,
      image,
      published: published === 'on'
    });

    req.flash('success', 'Event updated successfully!');
    res.redirect('/admin/events');
  } catch (error) {
    console.error('Error updating event:', error);
    req.flash('error', 'Error updating event');
    res.redirect(`/admin/events/edit/${req.params.id}`);
  }
};

// Delete event
exports.delete = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/admin/events');
    }

    // Delete image if exists
    if (event.image) {
      const imagePath = path.join(__dirname, '../public', event.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await event.destroy();

    req.flash('success', 'Event deleted successfully!');
    res.redirect('/admin/events');
  } catch (error) {
    console.error('Error deleting event:', error);
    req.flash('error', 'Error deleting event');
    res.redirect('/admin/events');
  }
};
