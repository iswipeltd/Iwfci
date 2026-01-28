const { Contact } = require('../models');
const { validationResult } = require('express-validator');
const { sendContactEmail } = require('../utils/email');

// Show contact form
exports.showForm = (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    success: req.flash('success'),
    error: req.flash('error')
  });
};

// Submit contact form
exports.submit = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect('/contact');
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    });

    // Send email to parent account
    await sendContactEmail({
      name,
      email,
      phone,
      subject,
      message
    });

    req.flash('success', 'Thank you for contacting us! We will get back to you soon.');
    res.redirect('/contact');
  } catch (error) {
    console.error('Error submitting contact form:', error);
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/contact');
  }
};

// Admin: List all contacts
exports.adminList = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.render('admin/contacts/list', {
      title: 'Contact Enquiries',
      contacts,
      username: req.session.username,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    req.flash('error', 'Error loading contacts');
    res.redirect('/admin/dashboard');
  }
};

// Admin: View contact details
exports.adminView = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      req.flash('error', 'Contact not found');
      return res.redirect('/admin/contacts');
    }

    // Mark as read
    if (contact.status === 'new') {
      await contact.update({ status: 'read' });
    }

    res.render('admin/contacts/view', {
      title: 'Contact Details',
      contact,
      username: req.session.username,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Error viewing contact:', error);
    req.flash('error', 'Error loading contact');
    res.redirect('/admin/contacts');
  }
};

// Admin: Delete contact
exports.adminDelete = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
      req.flash('error', 'Contact not found');
      return res.redirect('/admin/contacts');
    }

    await contact.destroy();

    req.flash('success', 'Contact deleted successfully!');
    res.redirect('/admin/contacts');
  } catch (error) {
    console.error('Error deleting contact:', error);
    req.flash('error', 'Error deleting contact');
    res.redirect('/admin/contacts');
  }
};
