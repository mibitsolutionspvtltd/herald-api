module.exports = (sequelize, DataTypes) => {
  const States = sequelize.define('States', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    state_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'country_codes',
        key: 'id'
      }
    },
    state_code: {
      type: DataTypes.STRING(10),
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
    tableName: 'states',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  States.associate = (models) => {
    States.belongsTo(models.CountryCodes, {
      foreignKey: 'country_id',
      as: 'country'
    });
  };

  return States;
};
