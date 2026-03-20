module.exports = (sequelize, DataTypes) => {
  const ArticleContentImage = sequelize.define(
    'ArticleContentImage',
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
      document_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'document',
          key: 'id',
        },
      },
      alt_text: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      caption: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image_order: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      created_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
    },
    {
      tableName: 'article_content_images',
      timestamps: false,
    }
  );

  ArticleContentImage.associate = (models) => {
    ArticleContentImage.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article',
    });
    ArticleContentImage.belongsTo(models.Document, {
      foreignKey: 'document_id',
      as: 'document',
    });
  };

  return ArticleContentImage;
};
