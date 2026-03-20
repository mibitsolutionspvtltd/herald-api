module.exports = (sequelize, DataTypes) => {
  const StateProvince = sequelize.define('StateProvince', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(69),
      allowNull: false,
      unique: true
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    iso_code: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    short_iso_code: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    state_code: {
      type: DataTypes.STRING(4),
      allowNull: false
    }
  }, {
    tableName: 'state_province',
    timestamps: false
  });

  StateProvince.associate = (models) => {
    StateProvince.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    });
    StateProvince.hasMany(models.City, {
      foreignKey: 'state_province_id',
      as: 'cities'
    });
  };

  return StateProvince;
};
