module.exports = (sequelize, DataTypes) => {
  const CountryCodes = sequelize.define('CountryCodes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    country_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    country_code: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    flag_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'country_codes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  CountryCodes.associate = (models) => {
    CountryCodes.hasMany(models.States, {
      foreignKey: 'country_id',
      as: 'states'
    });
  };

  return CountryCodes;
};
