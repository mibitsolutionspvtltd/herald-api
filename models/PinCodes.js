module.exports = (sequelize, DataTypes) => {
  const PinCodes = sequelize.define('PinCodes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    pin_code: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    tableName: 'pin_codes',
    timestamps: false
  });

  return PinCodes;
};
