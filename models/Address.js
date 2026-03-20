const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Address = sequelize.define('Address', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: false,
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    last_updated_on: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    zip_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'active_status',
        key: 'id'
      }
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'address_type',
        key: 'id'
      }
    },
    state_province_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'state_province',
        key: 'id'
      }
    },
  }, {
    tableName: 'address',
    timestamps: false,
  });

  Address.associate = (models) => {
    Address.belongsTo(models.ActiveStatus, {
      foreignKey: 'status_id',
      as: 'status'
    });
    Address.belongsTo(models.AddressType, {
      foreignKey: 'type_id',
      as: 'type'
    });
    Address.belongsTo(models.StateProvince, {
      foreignKey: 'state_province_id',
      as: 'stateProvince'
    });
  };

  return Address;
};
