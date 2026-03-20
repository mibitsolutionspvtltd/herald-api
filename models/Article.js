module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      url_slug: {
        type: DataTypes.STRING(200),
        allowNull: true,
        unique: false, // Removed unique constraint for flexibility
      },
      meta_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      meta_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      focus_keyword: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      allow_indexing: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      brief: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      time_to_read: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'operator',
          key: 'id',
        },
      },
      last_updated_on: {
        type: DataTypes.DATE(6),
        allowNull: true,
      },
      last_updated_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'operator',
          key: 'id',
        },
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'active_status',
          key: 'id',
        },
      },
      is_content_locked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      publish_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      like_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      // comment_count is in article_settings table
      document_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'document',
          key: 'id',
        },
      },
      cover_image_alt_text: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      access_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        references: {
          model: 'access_type',
          key: 'id',
        },
      },
      robots_meta_tag_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        references: {
          model: 'robots_meta_tag_type',
          key: 'id',
        },
      },
      // Advanced SEO Fields (Consolidated from ArticleSEO)
      canonical_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      structured_data_markup: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      og_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      og_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      og_image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      twitter_title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      twitter_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      twitter_image: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      schema_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        references: {
          model: 'schema_type',
          key: 'id',
        },
      },
      indexing_status_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1,
        references: {
          model: 'indexing_status_type',
          key: 'id',
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'category',
          key: 'id',
        },
      },
      article_label_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'article_label',
          key: 'id',
        },
      },
    },
    {
      tableName: 'article',
      timestamps: false,
    }
  );

  Article.associate = (models) => {
    // Status and Category
    Article.belongsTo(models.ActiveStatus, {
      foreignKey: 'status_id',
      as: 'status',
    });
    Article.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
    });
    Article.belongsTo(models.ArticleLabel, {
      foreignKey: 'article_label_id',
      as: 'label',
    });

    // Master Table Associations
    Article.belongsTo(models.AccessType, {
      foreignKey: 'access_type_id',
      as: 'accessType',
    });
    Article.belongsTo(models.RobotsMetaTagType, {
      foreignKey: 'robots_meta_tag_id',
      as: 'robotTags',
    });
    Article.belongsTo(models.SchemaType, {
      foreignKey: 'schema_type_id',
      as: 'schemaType',
    });
    Article.belongsTo(models.IndexingStatusType, {
      foreignKey: 'indexing_status_id',
      as: 'indexingStatus',
    });

    // Cover Image
    Article.belongsTo(models.Document, {
      foreignKey: 'document_id',
      as: 'coverImage',
    });

    // Created/Updated By
    Article.belongsTo(models.Operator, {
      foreignKey: 'created_by',
      as: 'creator',
    });
    Article.belongsTo(models.Operator, {
      foreignKey: 'last_updated_by',
      as: 'updater',
    });

    // Authors (many-to-many through article_authors)
    Article.belongsToMany(models.Operator, {
      through: 'article_authors',
      foreignKey: 'article_id',
      otherKey: 'author_id',
      as: 'authors',
    });

    // Tags (many-to-many through article_tag)
    Article.belongsToMany(models.Tag, {
      through: models.ArticleTag,
      foreignKey: 'article_id',
      otherKey: 'tag_id',
      as: 'tags',
    });

    // Related Posts (self-referencing many-to-many) - USING related_article table
    Article.belongsToMany(models.Article, {
      through: 'related_article',
      foreignKey: 'article_id',
      otherKey: 'related_article_id',
      as: 'relatedPosts',
    });

    // Content Images
    Article.hasMany(models.ArticleContentImage, {
      foreignKey: 'article_id',
      as: 'contentImages',
    });

    // Revisions
    Article.hasMany(models.ArticleRevision, {
      foreignKey: 'article_id',
      as: 'revisions',
    });

    // SEO Analysis
    Article.hasOne(models.ArticleSEOAnalysis, {
      foreignKey: 'article_id',
      as: 'seoAnalysis',
    });

    // Comments
    Article.hasMany(models.ArticleComment, {
      foreignKey: 'article_id',
      as: 'comments',
    });

    // Views
    Article.hasMany(models.ArticleViews, {
      foreignKey: 'article_id',
      as: 'views',
    });

    // Settings (contains comment_count, view_count, like_count)
    Article.hasOne(models.ArticleSettings, {
      foreignKey: 'article_id',
      as: 'settings',
    });
  };

  return Article;
};
