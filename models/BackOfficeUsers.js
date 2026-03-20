const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BackOfficeUsers = sequelize.define('BackOfficeUsers', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    two_factor_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    two_factor_secret: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    account_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    failed_login_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_password_change_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
  }, {
    tableName: 'back_office_users',
    timestamps: false,
    indexes: [
      {
        fields: ['created_by']
      },
      {
        fields: ['updated_by']
      }
    ]
  });

  BackOfficeUsers.associate = (models) => {
    BackOfficeUsers.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    BackOfficeUsers.belongsTo(models.Operator, {
      foreignKey: 'updated_by',
      as: 'updater'
    });
    BackOfficeUsers.hasMany(models.EntityOperatorRoleMapping, {
      foreignKey: 'back_office_user_id',
      as: 'roleMappings'
    });
  };

  return BackOfficeUsers;
};
