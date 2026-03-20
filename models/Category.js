module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    icon_url: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    created_on: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    last_updated_on: {
      type: DataTypes.DATE(6),
      allowNull: true
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'active_status',
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
    cover_image_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'document',
        key: 'id'
      }
    }
  }, {
    tableName: 'category',
    timestamps: false
  });

  Category.associate = (models) => {
    Category.belongsTo(models.ActiveStatus, {
      foreignKey: 'status_id',
      as: 'status'
    });
    Category.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'country'
    });
    Category.belongsTo(models.Document, {
      foreignKey: 'cover_image_id',
      as: 'coverImage'
    });
    Category.hasMany(models.Article, {
      foreignKey: 'category_id',
      as: 'articles'
    });
    Category.hasMany(models.Courses, {
      foreignKey: 'category_id',
      as: 'courses'
    });
    Category.hasMany(models.HeroContent, {
      foreignKey: 'category_id',
      as: 'heroContent'
    });
  };

  return Category;
};
