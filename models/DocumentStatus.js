const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DocumentStatus = sequelize.define('DocumentStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'document_status',
    timestamps: false,
  });

  return DocumentStatus;
};
