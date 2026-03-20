module.exports = (sequelize, DataTypes) => {
  // Model matches database schema: id, name
  const ArticleLabel = sequelize.define(
    'ArticleLabel',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'article_label',
      timestamps: false,
    }
  );

  ArticleLabel.associate = (models) => {
    ArticleLabel.hasMany(models.Article, {
      foreignKey: 'article_label_id',
      as: 'articles',
    });
  };

  return ArticleLabel;
};
