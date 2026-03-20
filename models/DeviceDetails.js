const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DeviceDetails = sequelize.define('DeviceDetails', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    device_token: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    device_type: {
      type: DataTypes.ENUM('android', 'ios', 'web'),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    created_on: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    imei_number: {
      type: DataTypes.STRING(128),
      allowNull: true,
      unique: true,
    },
    latitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mac_address: {
      type: DataTypes.STRING(128),
      allowNull: true,
      unique: true,
    },
    manufacturer: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    platform: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'device_details',
    timestamps: false,
    charset: 'latin1',
    collate: 'latin1_swedish_ci'
  });

  DeviceDetails.associate = (models) => {
    // User association removed - using operator-based system
    // Can be updated to use Operator model if needed:
    // DeviceDetails.belongsTo(models.Operator, {
    //   foreignKey: 'user_id', // or operator_id if column is renamed
    //   as: 'operator',
    //   onDelete: 'CASCADE'
    // });
  };

  return DeviceDetails;
};
