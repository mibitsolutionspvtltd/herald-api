const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tag = sequelize.define('Tag', {
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
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'tags',
    timestamps: false,
  });

  Tag.associate = (models) => {
    // Many-to-many with Article through article_tag
    Tag.belongsToMany(models.Article, {
      through: models.ArticleTag,
      foreignKey: 'tag_id',
      otherKey: 'article_id',
      as: 'articles',
    });
  };

  return Tag;
};
