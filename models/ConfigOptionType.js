module.exports = (sequelize, DataTypes) => {
  const ConfigOptionType = sequelize.define('ConfigOptionType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type_key: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      comment: 'e.g., articleStatus, contactPriority'
    },
    type_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Display name'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    last_updated_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'config_option_types',
    timestamps: false,
    indexes: [
      { fields: ['type_key'] },
      { fields: ['is_active'] }
    ],
    comment: 'Defines types of configuration options'
  });

  ConfigOptionType.associate = (models) => {
    ConfigOptionType.hasMany(models.ConfigOption, {
      foreignKey: 'option_type_id',
      as: 'options'
    });
  };

  return ConfigOptionType;
};
