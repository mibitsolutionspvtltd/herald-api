module.exports = (sequelize, DataTypes) => {
  const SearchMetadata = sequelize.define('SearchMetadata', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    subtitle: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    active_status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'active_status',
        key: 'id'
      }
    }
  }, {
    tableName: 'search_metadata',
    timestamps: false
  });

  SearchMetadata.associate = (models) => {
    SearchMetadata.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    });
    SearchMetadata.belongsTo(models.ActiveStatus, {
      foreignKey: 'active_status_id',
      as: 'status'
    });
  };

  return SearchMetadata;
};
