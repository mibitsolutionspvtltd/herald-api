module.exports = (sequelize, DataTypes) => {
  const RelatedArticle = sequelize.define('RelatedArticle', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'article',
        key: 'id'
      }
    },
    related_article_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'article',
        key: 'id'
      }
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    created_on: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'related_article',
    timestamps: false
  });

  RelatedArticle.associate = (models) => {
    RelatedArticle.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article'
    });
    RelatedArticle.belongsTo(models.Article, {
      foreignKey: 'related_article_id',
      as: 'relatedArticle'
    });
  };

  return RelatedArticle;
};
