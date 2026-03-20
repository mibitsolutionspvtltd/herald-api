module.exports = (sequelize, DataTypes) => {
  const ArticleSettings = sequelize.define(
    'ArticleSettings',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      article_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'article',
          key: 'id',
        },
      },
      is_content_locked: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      publish_date: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      author_ids: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      related_post_ids: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      view_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      like_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      comment_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
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
      tableName: 'article_settings',
      timestamps: false,
    }
  );

  ArticleSettings.associate = (models) => {
    ArticleSettings.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article',
    });
  };

  return ArticleSettings;
};
