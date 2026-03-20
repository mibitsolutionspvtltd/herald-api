const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pin = sequelize.define('Pin', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pin: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'city',
        key: 'id'
      }
    },
    state_province_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'state_province',
        key: 'id'
      }
    },
  }, {
    tableName: 'pin',
    timestamps: false,
  });

  Pin.associate = (models) => {
    Pin.belongsTo(models.City, {
      foreignKey: 'city_id',
      as: 'city'
    });
    Pin.belongsTo(models.StateProvince, {
      foreignKey: 'state_province_id',
      as: 'stateProvince'
    });
  };

  return Pin;
};
