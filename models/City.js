module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    city_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    state_province_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'state_province',
        key: 'id'
      }
    }
  }, {
    tableName: 'city',
    timestamps: false
  });

  City.associate = (models) => {
    City.belongsTo(models.StateProvince, {
      foreignKey: 'state_province_id',
      as: 'stateProvince'
    });
  };

  return City;
};
