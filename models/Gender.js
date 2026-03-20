const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Gender = sequelize.define('Gender', {
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
    tableName: 'gender',
    timestamps: false,
  });

  Gender.associate = (models) => {
    Gender.hasMany(models.Operator, {
      foreignKey: 'gender_id',
      as: 'operators'
    });
  };

  return Gender;
};
