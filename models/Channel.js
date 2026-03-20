const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Channel = sequelize.define('Channel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  }, {
    tableName: 'channel',
    timestamps: false,
  });

  return Channel;
};
