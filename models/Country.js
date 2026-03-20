module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true,
      unique: true
    },
    currency_code: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    currency_symbol: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    isd_code: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    language_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    iso_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ethnicity: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    currency_numberic_code: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    currency_minor_unit: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    iso_code_alpha3: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    numeric_iso_code: {
      type: DataTypes.STRING(4),
      allowNull: true
    },
    is_enable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    mobile_number_max_length: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    decimal_places: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 2
    }
  }, {
    tableName: 'country',
    timestamps: false
  });

  Country.associate = (models) => {
    Country.hasMany(models.StateProvince, {
      foreignKey: 'country_id',
      as: 'states'
    });
    Country.hasMany(models.Category, {
      foreignKey: 'country_id',
      as: 'categories'
    });
    Country.hasMany(models.HeroContent, {
      foreignKey: 'country_id',
      as: 'heroContent'
    });
  };

  return Country;
};
