module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Permission category like USER_MANAGEMENT, CONTENT_MANAGEMENT, etc.'
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Permission.associate = (models) => {
    Permission.belongsToMany(models.RoleType, {
      through: 'RolePermissions',
      foreignKey: 'permission_id',
      otherKey: 'role_type_id',
      as: 'roles'
    });
  };

  return Permission;
};
