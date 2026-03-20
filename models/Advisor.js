const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Advisor = sequelize.define('Advisor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    uid: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    invitation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'invitation',
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
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    checksum: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    parent_partner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'partner',
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
    role_type_id: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      references: {
        model: 'role_type',
        key: 'id'
      }
    },
  }, {
    tableName: 'advisor',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });

  Advisor.associate = (models) => {
    Advisor.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    });
    Advisor.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    Advisor.belongsTo(models.Operator, {
      foreignKey: 'last_updated_by',
      as: 'updater'
    });
    Advisor.belongsTo(models.Partner, {
      foreignKey: 'parent_partner_id',
      as: 'parentPartner'
    });
    Advisor.belongsTo(models.ActiveStatus, {
      foreignKey: 'active_status_id',
      as: 'activeStatus'
    });
    Advisor.belongsTo(models.RoleType, {
      foreignKey: 'role_type_id',
      as: 'roleType'
    });
    Advisor.belongsTo(models.Invitation, {
      foreignKey: 'invitation_id',
      as: 'invitation'
    });
  };

  return Advisor;
};
