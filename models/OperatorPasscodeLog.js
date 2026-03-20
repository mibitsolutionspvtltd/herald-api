const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OperatorPasscodeLog = sequelize.define('OperatorPasscodeLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    passcode: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    operator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    active_status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      references: {
        model: 'active_status',
        key: 'id'
      }
    },
    retry_attempt: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    retried_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    expiry_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    channel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'channel',
        key: 'id'
      }
    },
    device_details_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'device_details',
        key: 'id'
      }
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'active_status',
        key: 'id'
      }
    },
  }, {
    tableName: 'operator_passcode_log',
    timestamps: false,
  });

  OperatorPasscodeLog.associate = (models) => {
    OperatorPasscodeLog.belongsTo(models.Operator, {
      foreignKey: 'operator_id',
      as: 'operator'
    });
    OperatorPasscodeLog.belongsTo(models.ActiveStatus, {
      foreignKey: 'active_status_id',
      as: 'activeStatus'
    });
    OperatorPasscodeLog.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    OperatorPasscodeLog.belongsTo(models.Channel, {
      foreignKey: 'channel_id',
      as: 'channel'
    });
    OperatorPasscodeLog.belongsTo(models.DeviceDetails, {
      foreignKey: 'device_details_id',
      as: 'deviceDetails'
    });
    OperatorPasscodeLog.belongsTo(models.ActiveStatus, {
      foreignKey: 'status_id',
      as: 'status'
    });
  };

  return OperatorPasscodeLog;
};
