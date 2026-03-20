module.exports = (sequelize, DataTypes) => {
  const RoleType = sequelize.define('RoleType', {
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    default_permission: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Comma-separated permissions like CREATE_ARTICLE,EDIT_OWN_ARTICLE,DELETE_ARTICLE,PUBLISH_ARTICLE'
    },
    is_enable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    app_allowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    two_factor_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    tableName: 'role_type',
    timestamps: false
  });

  // Define role constants
  RoleType.ROLES = {
    ADMIN: 'ADMIN',
    VIEWER: 'VIEWER',
    CONTENT_WRITER: 'CONTENT_WRITER',
    EDITOR: 'EDITOR',
    CONTENT_MANAGER: 'CONTENT_MANAGER'
  };

  // Define permission constants
  RoleType.PERMISSIONS = {
    // Full Access
    ALL: 'ALL',

    // User Management
    CREATE_USER: 'CREATE_USER',
    VIEW_USER: 'VIEW_USER',
    EDIT_USER: 'EDIT_USER',
    DELETE_USER: 'DELETE_USER',

    // Admin Management (Super Admin Only)
    CREATE_ADMIN: 'CREATE_ADMIN',
    DELETE_ADMIN: 'DELETE_ADMIN',
    MANAGE_ADMINS: 'MANAGE_ADMINS',

    // Article Management
    CREATE_ARTICLE: 'CREATE_ARTICLE',
    VIEW_ARTICLE: 'VIEW_ARTICLE',
    EDIT_OWN_ARTICLE: 'EDIT_OWN_ARTICLE',
    EDIT_ANY_ARTICLE: 'EDIT_ANY_ARTICLE',
    DELETE_ARTICLE: 'DELETE_ARTICLE',
    DELETE_OWN_ARTICLE: 'DELETE_OWN_ARTICLE',
    PUBLISH_ARTICLE: 'PUBLISH_ARTICLE',
    APPROVE_ARTICLE: 'APPROVE_ARTICLE',
    REJECT_ARTICLE: 'REJECT_ARTICLE',

    // Category Management
    CREATE_CATEGORY: 'CREATE_CATEGORY',
    VIEW_CATEGORY: 'VIEW_CATEGORY',
    EDIT_CATEGORY: 'EDIT_CATEGORY',
    DELETE_CATEGORY: 'DELETE_CATEGORY',

    // Hero Content Management
    CREATE_HERO_CONTENT: 'CREATE_HERO_CONTENT',
    VIEW_HERO_CONTENT: 'VIEW_HERO_CONTENT',
    EDIT_HERO_CONTENT: 'EDIT_HERO_CONTENT',
    DELETE_HERO_CONTENT: 'DELETE_HERO_CONTENT',
    MANAGE_HERO_CONTENT: 'MANAGE_HERO_CONTENT',

    // Carousel Management
    CREATE_CAROUSEL: 'CREATE_CAROUSEL',
    VIEW_CAROUSEL: 'VIEW_CAROUSEL',
    EDIT_CAROUSEL: 'EDIT_CAROUSEL',
    DELETE_CAROUSEL: 'DELETE_CAROUSEL',

    // Course Management
    CREATE_COURSE: 'CREATE_COURSE',
    VIEW_COURSE: 'VIEW_COURSE',
    EDIT_COURSE: 'EDIT_COURSE',
    DELETE_COURSE: 'DELETE_COURSE',

    // University Management
    CREATE_UNIVERSITY: 'CREATE_UNIVERSITY',
    VIEW_UNIVERSITY: 'VIEW_UNIVERSITY',
    EDIT_UNIVERSITY: 'EDIT_UNIVERSITY',
    DELETE_UNIVERSITY: 'DELETE_UNIVERSITY',

    // Document Management
    CREATE_DOCUMENT: 'CREATE_DOCUMENT',
    VIEW_DOCUMENT: 'VIEW_DOCUMENT',
    EDIT_DOCUMENT: 'EDIT_DOCUMENT',
    DELETE_DOCUMENT: 'DELETE_DOCUMENT',
    MANAGE_DOCUMENTS: 'MANAGE_DOCUMENTS',

    // Contact Management
    VIEW_CONTACT: 'VIEW_CONTACT',
    MANAGE_CONTACT: 'MANAGE_CONTACT',

    // System Management
    MANAGE_ROLES: 'MANAGE_ROLES',
    MANAGE_PERMISSIONS: 'MANAGE_PERMISSIONS',
    VIEW_ANALYTICS: 'VIEW_ANALYTICS',
    VIEW_REPORTS: 'VIEW_REPORTS',
    VIEW_SETTINGS: 'VIEW_SETTINGS',
    EDIT_SETTINGS: 'EDIT_SETTINGS',
    SYSTEM_SETTINGS: 'SYSTEM_SETTINGS',
    ACCESS_ADMIN_PORTAL: 'ACCESS_ADMIN_PORTAL'
  };

  RoleType.associate = (models) => {
    RoleType.hasMany(models.EntityOperatorRoleMapping, {
      foreignKey: 'role_type_id',
      as: 'roleMappings'
    });
    RoleType.hasMany(models.RolePermissions, {
      foreignKey: 'role_type_id',
      as: 'rolePermissions'
    });
    RoleType.hasMany(models.RoleNesting, {
      foreignKey: 'role_type_id',
      as: 'roleNestings'
    });
    RoleType.hasMany(models.ContentCreators, {
      foreignKey: 'role_type_id',
      as: 'contentCreators'
    });
  };

  return RoleType;
};
