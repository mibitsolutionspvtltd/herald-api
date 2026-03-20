module.exports = (sequelize, DataTypes) => {
  const ArticleAuthor = sequelize.define(
    'ArticleAuthor',
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
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'operator',
          key: 'id',
        },
      },
      author_order: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      created_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: 'article_authors',
      timestamps: false,
    }
  );

  ArticleAuthor.associate = (models) => {
    ArticleAuthor.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article',
    });
    ArticleAuthor.belongsTo(models.Operator, {
      foreignKey: 'author_id',
      as: 'author',
    });
  };

  return ArticleAuthor;
};
