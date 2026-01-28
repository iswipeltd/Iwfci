const sequelize = require('../config/database');
const Admin = require('./Admin');
const Event = require('./Event');
const Blog = require('./Blog');
const Contact = require('./Contact');
const HeroSlide = require('./HeroSlide');
const Highlight = require('./Highlight');
const BoardMember = require('./BoardMember');

// Define associations here if needed
// Example: Blog.belongsTo(Admin, { foreignKey: 'adminId' });

const db = {
  sequelize,
  Admin,
  Event,
  Blog,
  Contact,
  HeroSlide,
  Highlight,
  BoardMember
};

module.exports = db;
