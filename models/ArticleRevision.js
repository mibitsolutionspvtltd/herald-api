module.exports = (sequelize, DataTypes) => {
  const ArticleRevision = sequelize.define(
    'ArticleRevision',
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
      title: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      brief: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      revision_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'operator',
          key: 'id',
        },
      },
      created_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      revision_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'article_revisions',
      timestamps: false,
    }
  );

  ArticleRevision.associate = (models) => {
    ArticleRevision.belongsTo(models.Article, {
      foreignKey: 'article_id',
      as: 'article',
    });
    ArticleRevision.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator',
    });
  };

  return ArticleRevision;
};
