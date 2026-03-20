const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PreferredLanguage = sequelize.define('PreferredLanguage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  }, {
    tableName: 'preferred_language',
    timestamps: false,
  });

  PreferredLanguage.associate = (models) => {
    PreferredLanguage.hasMany(models.Operator, {
      foreignKey: 'preferred_language_id',
      as: 'operators'
    });
  };

  return PreferredLanguage;
};
