module.exports = (sequelize, DataTypes) => {
  const EntityOperatorRoleMapping = sequelize.define('EntityOperatorRoleMapping', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    active_status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'active_status',
        key: 'id'
      }
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_updated_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    last_updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    consumer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'consumer',
        key: 'id'
      }
    },
    advisor_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'advisor',
        key: 'id'
      }
    },
    partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'partner',
        key: 'id'
      }
    },
    role_type_id: {
      type: DataTypes.SMALLINT,
      defaultValue: 4,
      references: {
        model: 'role_type',
        key: 'id'
      }
    },
    parent_partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'partner',
        key: 'id'
      }
    },
    operator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    checksum: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    referred_by_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'entity_operator_role_mapping',
        key: 'id'
      }
    },
    referral_code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_eligible_for_loan: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    back_office_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'back_office_users',
        key: 'id'
      }
    }
  }, {
    tableName: 'entity_operator_role_mapping',
    timestamps: false
  });

  EntityOperatorRoleMapping.associate = (models) => {
    EntityOperatorRoleMapping.belongsTo(models.Operator, {
      foreignKey: 'operator_id',
      as: 'operator'
    });
    EntityOperatorRoleMapping.belongsTo(models.RoleType, {
      foreignKey: 'role_type_id',
      as: 'roleType'
    });
    EntityOperatorRoleMapping.belongsTo(models.ActiveStatus, {
      foreignKey: 'active_status_id',
      as: 'status'
    });
    EntityOperatorRoleMapping.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    EntityOperatorRoleMapping.belongsTo(models.Operator, {
      foreignKey: 'last_updated_by',
      as: 'updater'
    });
    EntityOperatorRoleMapping.belongsTo(models.Consumer, {
      foreignKey: 'consumer_id',
      as: 'consumer'
    });
    EntityOperatorRoleMapping.belongsTo(models.Advisor, {
      foreignKey: 'advisor_id',
      as: 'advisor'
    });
    EntityOperatorRoleMapping.belongsTo(models.Partner, {
      foreignKey: 'partner_id',
      as: 'partner'
    });
    EntityOperatorRoleMapping.belongsTo(models.Partner, {
      foreignKey: 'parent_partner_id',
      as: 'parentPartner'
    });
    EntityOperatorRoleMapping.belongsTo(models.EntityOperatorRoleMapping, {
      foreignKey: 'referred_by_id',
      as: 'referredBy'
    });
    EntityOperatorRoleMapping.belongsTo(models.BackOfficeUsers, {
      foreignKey: 'back_office_user_id',
      as: 'backOfficeUser'
    });
  };

  return EntityOperatorRoleMapping;
};
