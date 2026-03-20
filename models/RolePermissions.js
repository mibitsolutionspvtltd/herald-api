module.exports = (sequelize, DataTypes) => {
  const RolePermissions = sequelize.define('RolePermissions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    role_type_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'role_type',
        key: 'id'
      }
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'id'
      }
    },
    is_granted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'role_permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['role_type_id', 'permission_id']
      }
    ]
  });

  RolePermissions.associate = (models) => {
    RolePermissions.belongsTo(models.RoleType, {
      foreignKey: 'role_type_id',
      as: 'roleType'
    });
    RolePermissions.belongsTo(models.Permission, {
      foreignKey: 'permission_id',
      as: 'permission'
    });
  };

  return RolePermissions;
};
