const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HeroSlide = sequelize.define('HeroSlide', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  buttonText: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'Learn More'
  },
  buttonLink: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'hero_slides',
  timestamps: true
});

module.exports = HeroSlide;
