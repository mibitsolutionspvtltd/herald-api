const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UniversityCourses = sequelize.define('UniversityCourses', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course: {
      type: DataTypes.STRING(174),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(942),
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(470),
      allowNull: true,
    },
    eligiblity: {
      type: DataTypes.STRING(1374),
      allowNull: true,
    },
    university: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    zipcode: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    link_to_course: {
      type: DataTypes.STRING(327),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'university_courses',
    timestamps: false,
  });

  return UniversityCourses;
};
