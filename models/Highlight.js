const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Highlight = sequelize.define('Highlight', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  metric: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., "1,200+ entrepreneurs"'
  },
  percentage: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 100
  },
  year: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  additionalInfo: {
    type: DataTypes.STRING(200),
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
  tableName: 'highlights',
  timestamps: true
});

module.exports = Highlight;
