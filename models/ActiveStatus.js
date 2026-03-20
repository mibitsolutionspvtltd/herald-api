module.exports = (sequelize, DataTypes) => {
  const ActiveStatus = sequelize.define('ActiveStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'active_status',
    timestamps: false
  });

  ActiveStatus.associate = (models) => {
    ActiveStatus.hasMany(models.Article, {
      foreignKey: 'status_id',
      as: 'articles'
    });
    ActiveStatus.hasMany(models.Category, {
      foreignKey: 'status_id',
      as: 'categories'
    });
    ActiveStatus.hasMany(models.Document, {
      foreignKey: 'status_id',
      as: 'documents'
    });
    ActiveStatus.hasMany(models.Address, {
      foreignKey: 'status_id',
      as: 'addresses'
    });
    ActiveStatus.hasMany(models.Advisor, {
      foreignKey: 'active_status_id',
      as: 'advisors'
    });
    ActiveStatus.hasMany(models.CarouselItems, {
      foreignKey: 'status_id',
      as: 'carouselItems'
    });
    ActiveStatus.hasMany(models.EntityOperatorRoleMapping, {
      foreignKey: 'active_status_id',
      as: 'entityOperatorRoleMappings'
    });
    ActiveStatus.hasMany(models.HeroContent, {
      foreignKey: 'active_status_id',
      as: 'heroContents'
    });
    ActiveStatus.hasMany(models.Invitation, {
      foreignKey: 'status_id',
      as: 'invitations'
    });
    ActiveStatus.hasMany(models.OperatorOTPLog, {
      foreignKey: 'active_status_id',
      as: 'operatorOTPLogs'
    });
    ActiveStatus.hasMany(models.OperatorOTPLog, {
      foreignKey: 'status_id',
      as: 'operatorOTPLogsByStatus'
    });
    ActiveStatus.hasMany(models.OperatorPasscodeLog, {
      foreignKey: 'active_status_id',
      as: 'operatorPasscodeLogs'
    });
    ActiveStatus.hasMany(models.OperatorPasscodeLog, {
      foreignKey: 'status_id',
      as: 'operatorPasscodeLogsByStatus'
    });
    ActiveStatus.hasMany(models.Partner, {
      foreignKey: 'active_status_id',
      as: 'partners'
    });
    ActiveStatus.hasMany(models.StateProvince, {
      foreignKey: 'active_status_id',
      as: 'stateProvinces'
    });
  };

  return ActiveStatus;
};
