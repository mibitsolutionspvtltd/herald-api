module.exports = (sequelize, DataTypes) => {
  const ArticleSEO = sequelize.define(
    'ArticleSEO',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'article',
          key: 'id',
        },
      },
      meta_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      meta_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      url_slug: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      focus_keyword: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      allow_indexing: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      robots_meta_tag_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        references: {
          model: 'robots_meta_tag_type',
          key: 'id',
        },
        comment: 'FK to robots_meta_tag_type master table',
      },
      canonical_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      structured_data_markup: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      og_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      og_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      og_image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      twitter_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      twitter_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      twitter_image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      last_updated_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'article_seo',
      timestamps: false,
    }
  );

  ArticleSEO.associate = (models) => {
    ArticleSEO.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article',
    });
    ArticleSEO.belongsTo(models.RobotsMetaTagType, {
      foreignKey: 'robots_meta_tag_id',
      as: 'robotsMetaTag',
    });
  };

  return ArticleSEO;
};
