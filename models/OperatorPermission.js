const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OperatorPermission = sequelize.define('OperatorPermission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    permission: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    last_updated_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    entity_operator_role_mapping_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entity_operator_role_mapping',
        key: 'id'
      }
    },
  }, {
    tableName: 'operator_permission',
    timestamps: false,
  });

  OperatorPermission.associate = (models) => {
    OperatorPermission.belongsTo(models.ActiveStatus, {
      foreignKey: 'active_status_id',
      as: 'activeStatus'
    });
    OperatorPermission.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    OperatorPermission.belongsTo(models.Operator, {
      foreignKey: 'last_updated_by',
      as: 'updater'
    });
    OperatorPermission.belongsTo(models.EntityOperatorRoleMapping, {
      foreignKey: 'entity_operator_role_mapping_id',
      as: 'entityOperatorRoleMapping'
    });
  };

  return OperatorPermission;
};
