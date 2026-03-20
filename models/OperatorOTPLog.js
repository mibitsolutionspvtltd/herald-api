const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OperatorOTPLog = sequelize.define('OperatorOTPLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    operator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'operator',
        key: 'id',
      },
    },
    otp: {
      type: DataTypes.STRING(256),
      allowNull: false,
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
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'active_status',
        key: 'id'
      }
    },
  }, {
    tableName: 'operator_otp_log',
    timestamps: false,
  });

  OperatorOTPLog.associate = (models) => {
    OperatorOTPLog.belongsTo(models.Operator, {
      foreignKey: 'operator_id',
      as: 'operator'
    });
    OperatorOTPLog.belongsTo(models.ActiveStatus, {
      foreignKey: 'active_status_id',
      as: 'activeStatus'
    });
    OperatorOTPLog.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    OperatorOTPLog.belongsTo(models.Channel, {
      foreignKey: 'channel_id',
      as: 'channel'
    });
    OperatorOTPLog.belongsTo(models.ActiveStatus, {
      foreignKey: 'status_id',
      as: 'status'
    });
  };

  return OperatorOTPLog;
};
