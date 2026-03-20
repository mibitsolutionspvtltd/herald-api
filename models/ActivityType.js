const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ActivityType = sequelize.define('ActivityType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  }, {
    tableName: 'activity_type',
    timestamps: false,
  });

  return ActivityType;
};
