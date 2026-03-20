const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeviceRegistration = sequelize.define('DeviceRegistration', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    device_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    fcm_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    platform: {
      type: DataTypes.ENUM('iOS', 'Android', 'Web'),
      allowNull: false,
    },
    app_version: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    os_version: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    device_model: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    last_used_at: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    last_updated_on: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'device_registrations',
    timestamps: false,
  });

  DeviceRegistration.associate = (models) => {
    // User association removed - using operator-based system
    // Can be updated to use Operator model if needed:
    // DeviceRegistration.belongsTo(models.Operator, {
    //   foreignKey: 'user_id', // or operator_id if column is renamed
    //   as: 'operator'
    // });
  };

  return DeviceRegistration;
};
