module.exports = (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define(
    'ArticleTag',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      article_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'article',
          key: 'id',
        },
      },
      tag: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'Tag name stored as string (not a foreign key)'
      },
      tag_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      last_updated_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: 'article_tag',
      timestamps: false,
    }
  );

  ArticleTag.associate = (models) => {
    ArticleTag.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article',
    });
    // Note: No relationship to Tag model - tags are stored as strings
  };

  return ArticleTag;
};
