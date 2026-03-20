const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PartyType = sequelize.define('PartyType', {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, {
    tableName: 'party_type',
    timestamps: false,
  });

  return PartyType;
};
