module.exports = (sequelize, DataTypes) => {
  const ArticleSEOAnalysis = sequelize.define(
    'ArticleSEOAnalysis',
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
      seo_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      readability_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      keyword_density: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      has_meta_description: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      has_focus_keyword: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      has_alt_texts: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      word_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      recommendations: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      analyzed_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: 'article_seo_analysis',
      timestamps: false,
    }
  );

  ArticleSEOAnalysis.associate = (models) => {
    ArticleSEOAnalysis.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article',
    });
  };

  return ArticleSEOAnalysis;
};
