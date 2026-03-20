module.exports = (sequelize, DataTypes) => {
  const NavigationMenu = sequelize.define('NavigationMenu', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'For nested menus',
      references: {
        model: 'navigation_menu',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    path: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    required_permissions: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of permission codes'
    },
    required_roles: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of role codes'
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Additional menu configuration'
    },
    created_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    last_updated_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'navigation_menu',
    timestamps: false,
    indexes: [
      { fields: ['parent_id'] },
      { fields: ['display_order'] },
      { fields: ['is_active'] }
    ],
    comment: 'Dynamic navigation menu structure with permission-based visibility'
  });

  NavigationMenu.associate = (models) => {
    // Self-referencing association for parent-child relationship
    NavigationMenu.hasMany(models.NavigationMenu, {
      foreignKey: 'parent_id',
      as: 'children'
    });
    
    NavigationMenu.belongsTo(models.NavigationMenu, {
      foreignKey: 'parent_id',
      as: 'parent'
    });
  };

  return NavigationMenu;
};
