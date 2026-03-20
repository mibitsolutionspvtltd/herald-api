module.exports = (sequelize, DataTypes) => {
  const ConfigOption = sequelize.define('ConfigOption', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    option_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'config_option_types',
        key: 'id'
      }
    },
    value: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Internal value (e.g., "published", "pending")'
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Display label'
    },
    variant: {
      type: DataTypes.STRING(50),
      defaultValue: 'default',
      comment: 'Badge color variant: success, warning, danger, info, primary, secondary'
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Optional icon name'
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional configuration data'
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
    tableName: 'config_options',
    timestamps: false,
    indexes: [
      { 
        unique: true, 
        fields: ['option_type_id', 'value'],
        name: 'unique_option'
      },
      { fields: ['option_type_id'] },
      { fields: ['display_order'] },
      { fields: ['is_active'] }
    ],
    comment: 'Stores all configuration option values with display properties'
  });

  ConfigOption.associate = (models) => {
    ConfigOption.belongsTo(models.ConfigOptionType, {
      foreignKey: 'option_type_id',
      as: 'optionType'
    });
  };

  return ConfigOption;
};
