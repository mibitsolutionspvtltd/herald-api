const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Consumer = sequelize.define('Consumer', {
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
    tableName: 'consumer',
    timestamps: false,
    charset: 'utf8',
    collate: 'utf8_general_ci'
  });

  Consumer.associate = (models) => {
    Consumer.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    });
    Consumer.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    Consumer.belongsTo(models.Operator, {
      foreignKey: 'last_updated_by',
      as: 'updater'
    });
    Consumer.belongsTo(models.Partner, {
      foreignKey: 'parent_partner_id',
      as: 'parentPartner'
    });
    Consumer.belongsTo(models.ActiveStatus, {
      foreignKey: 'active_status_id',
      as: 'activeStatus'
    });
    Consumer.belongsTo(models.RoleType, {
      foreignKey: 'role_type_id',
      as: 'roleType'
    });
    Consumer.belongsTo(models.Invitation, {
      foreignKey: 'invitation_id',
      as: 'invitation'
    });
  };

  return Consumer;
};
