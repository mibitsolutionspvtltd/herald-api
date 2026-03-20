module.exports = (sequelize, DataTypes) => {
  // Model matches database schema: id, last_updated_on, view_count, article_id
  const ArticleViews = sequelize.define(
    'ArticleViews',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      view_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      article_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'article',
          key: 'id',
        },
      },
      last_updated_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: 'article_views',
      timestamps: false,
    }
  );

  ArticleViews.associate = (models) => {
    ArticleViews.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article',
    });
  };

  return ArticleViews;
};
