const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OperatorActivityLog = sequelize.define('OperatorActivityLog', {
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
    activity_type: {
      type: DataTypes.ENUM(
        'LOGIN', 
        'LOGOUT', 
        'PROFILE_UPDATE', 
        'PASSWORD_CHANGE',
        'OTP_REQUEST',
        'OTP_VERIFY',
        'DATA_ACCESS',
        'DATA_MODIFY',
        'SYSTEM_ACTION'
      ),
      allowNull: false,
    },
    activity_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    request_method: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    request_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    response_status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    created_on: {
      type: DataTypes.DATE(6),
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'operator_activity_log',
    timestamps: false,
    indexes: [
      {
        fields: ['operator_id']
      },
      {
        fields: ['activity_type']
      },
      {
        fields: ['created_on']
      },
      {
        fields: ['operator_id', 'activity_type']
      }
    ]
  });

  OperatorActivityLog.associate = (models) => {
    OperatorActivityLog.belongsTo(models.Operator, {
      foreignKey: 'operator_id',
      as: 'operator'
    });
  };

  return OperatorActivityLog;
};
