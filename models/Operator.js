/**
 * Operator Model - Unified User System
 * 
 * This is the primary user model for the system. All users (including admins)
 * are stored in this table with role-based access control.
 * 
 * User Types (determined by role):
 * - Admin users: Operators with ADMIN or SUPER_ADMIN role type
 * - Content managers: Operators with CONTENT_MANAGER role type
 * - Editors: Operators with EDITOR role type
 * - Content writers: Operators with CONTENT_WRITER role type
 * - Viewers: Operators with VIEWER role type
 * 
 * Relationships:
 * - EntityOperatorRoleMapping: Links operator to roles
 * - BackOfficeUsers: Stores authentication credentials
 * - RoleType: Defines available roles and permissions
 */
module.exports = (sequelize, DataTypes) => {
  const Operator = sequelize.define('Operator', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    middle_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    created_on: {
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
    last_updated_on: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'operator',
        key: 'id'
      }
    },
    checksum: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    two_factor_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    uid: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    password_reset: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isd_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    preferred_language_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'preferred_language',
        key: 'id'
      }
    },
    mobile_number: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    mobile_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    pan_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    father_first_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    father_last_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_aadhar_mobile_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    gender_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'gender',
        key: 'id'
      }
    }
  }, {
    tableName: 'operator',
    timestamps: false
  });

  Operator.associate = (models) => {
    Operator.hasMany(models.EntityOperatorRoleMapping, {
      foreignKey: 'operator_id',
      as: 'roleMappings'
    });
    Operator.hasMany(models.OperatorOTPLog, {
      foreignKey: 'operator_id',
      as: 'otpLogs'
    });
    Operator.hasMany(models.OperatorActivityLog, {
      foreignKey: 'operator_id',
      as: 'activityLogs'
    });
    Operator.hasMany(models.Document, {
      foreignKey: 'created_by',
      as: 'createdDocuments'
    });
    Operator.hasMany(models.Document, {
      foreignKey: 'last_updated_by',
      as: 'updatedDocuments'
    });
    Operator.belongsTo(models.Gender, {
      foreignKey: 'gender_id',
      as: 'genderInfo'
    });
    Operator.belongsTo(models.PreferredLanguage, {
      foreignKey: 'preferred_language_id',
      as: 'preferredLanguage'
    });
    Operator.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator'
    });
    Operator.belongsTo(models.Operator, {
      foreignKey: 'last_updated_by',
      as: 'updater'
    });
    // Article authorship (many-to-many through article_authors)
    Operator.belongsToMany(models.Article, {
      through: 'article_authors',
      foreignKey: 'author_id',
      otherKey: 'article_id',
      as: 'authoredArticles'
    });
  };

  /**
   * Check if operator has admin role
   * @param {Object} models - Sequelize models
   * @returns {Promise<boolean>}
   */
  Operator.prototype.isAdmin = async function(models) {
    const roleMappings = await models.EntityOperatorRoleMapping.findAll({
      where: { 
        operator_id: this.id,
        active_status_id: 1
      },
      include: [{
        model: models.RoleType,
        as: 'roleType',
        where: { is_enable: true }
      }]
    });

    return roleMappings.some(mapping => 
      mapping.roleType?.code === 'ADMIN' || mapping.roleType?.code === 'SUPER_ADMIN'
    );
  };

  /**
   * Get operator's roles
   * @param {Object} models - Sequelize models
   * @returns {Promise<Array>}
   */
  Operator.prototype.getRoles = async function(models) {
    const roleMappings = await models.EntityOperatorRoleMapping.findAll({
      where: { 
        operator_id: this.id,
        active_status_id: 1
      },
      include: [{
        model: models.RoleType,
        as: 'roleType',
        where: { is_enable: true }
      }]
    });

    return roleMappings.map(mapping => ({
      id: mapping.roleType?.id,
      name: mapping.roleType?.name,
      code: mapping.roleType?.code
    })).filter(role => role.id);
  };

  /**
   * Get operator's permissions
   * @param {Object} models - Sequelize models
   * @returns {Promise<Array>}
   */
  Operator.prototype.getPermissions = async function(models) {
    const roleMappings = await models.EntityOperatorRoleMapping.findAll({
      where: { 
        operator_id: this.id,
        active_status_id: 1
      },
      include: [{
        model: models.RoleType,
        as: 'roleType',
        where: { is_enable: true }
      }]
    });

    const permissionsSet = new Set();
    
    for (const mapping of roleMappings) {
      if (mapping.roleType?.default_permission) {
        const perms = mapping.roleType.default_permission.split(',').map(p => p.trim());
        perms.forEach(p => permissionsSet.add(p));
      }
    }

    return Array.from(permissionsSet);
  };

  /**
   * Get full name
   * @returns {string}
   */
  Operator.prototype.getFullName = function() {
    const parts = [this.first_name, this.middle_name, this.last_name].filter(Boolean);
    return parts.join(' ') || this.email || 'Unknown';
  };

  return Operator;
};
