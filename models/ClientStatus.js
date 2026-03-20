const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ClientStatus = sequelize.define('ClientStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'client_status',
    timestamps: false,
  });

  return ClientStatus;
};
