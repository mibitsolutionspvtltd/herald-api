const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AddressType = sequelize.define('AddressType', {
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
    tableName: 'address_type',
    timestamps: false,
  });

  AddressType.associate = (models) => {
    AddressType.hasMany(models.Address, {
      foreignKey: 'type_id',
      as: 'addresses'
    });
  };

  return AddressType;
};
