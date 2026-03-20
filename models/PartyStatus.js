const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PartyStatus = sequelize.define('PartyStatus', {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    client_status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'client_status',
        key: 'id'
      }
    },
  }, {
    tableName: 'party_status',
    timestamps: false,
  });

  PartyStatus.associate = (models) => {
    PartyStatus.belongsTo(models.ClientStatus, {
      foreignKey: 'client_status_id',
      as: 'clientStatus'
    });
  };

  return PartyStatus;
};
