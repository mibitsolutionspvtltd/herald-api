const { Article, ArticleLabel, Category, ActiveStatus, Document, sequelize } = require('../models');
const db = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// Get articles by label
exports.getArticles = async (req, res, next) => {
  try {
    const { label, page = 0, size = 20 } = req.query;
    const offset = page * size;
    const limit = parseInt(size);

    const whereClause = {
      [Op.or]: [{ status_id: { [Op.ne]: 2 } }, { status_id: { [Op.is]: null } }],
    };

    // Add label filter if provided
    if (label && ['popular', 'featured', 'recent', 'trending'].includes(label)) {
      const labelRecord = await ArticleLabel.findOne({ where: { name: label } });
      if (labelRecord) {
        whereClause.article_label_id = labelRecord.id;
      }
    }

    const articles = await Article.findAll({
      where: whereClause,
      include: [
        { model: Category, as: 'category', required: false },
        { model: Document, as: 'coverImage', required: false },
      ],
      // Sort by created_on DESC (newest first) - this ensures latest articles appear first
      order: [['created_on', 'DESC']],
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      data: articles.map((article) => ({
        id: article.id.toString(),
        title: article.title,
        brief: article.brief,
        imageUrl: article.coverImage ? article.coverImage.url : null,
        category: article.category ? article.category.name : 'Uncategorized',
        timeToRead: article.time_to_read || '5 min',
        createdAt: article.created_on, // Include creation date for frontend sorting
      })),
    });
  } catch (error) {
    next(error);
  }
};

// Get all articles (admin)
exports.getAllArticles = async (req, res, next) => {
  try {
    const { page = 1, size = 100, sortBy = 'created_on', sortOrder = 'DESC', search, category, label, status, author } = req.query;
    const offset = (page - 1) * size;
    const limit = parseInt(size);

    const whereClause = {
      [Op.or]: [{ status_id: { [Op.ne]: 2 } }, { status_id: { [Op.is]: null } }],
    };

    if (search) {
      whereClause[Op.and] = [
        { [Op.or]: [{ status_id: { [Op.ne]: 2 } }, { status_id: { [Op.is]: null } }] },
        { [Op.or]: [{ title: { [Op.like]: `%${search}%` } }, { brief: { [Op.like]: `%${search}%` } }] },
      ];
    }

    if (category && category !== 'all') {
      whereClause.category_id = category;
    }

    if (label && label !== 'all') {
      const labelRecord = await ArticleLabel.findOne({ where: { name: label } });
      if (labelRecord) whereClause.article_label_id = labelRecord.id;
    }

    // Filter by status
    if (status && status !== 'all') {
      whereClause.status_id = parseInt(status);
    }

    // Filter by author (created_by field)
    if (author && author !== 'all') {
      whereClause.created_by = parseInt(author);
    }

    const { ArticleViews, ArticleSettings } = require('../models');
    const articles = await Article.findAndCountAll({
      where: whereClause,
      include: [
        { model: Category, as: 'category' },
        { model: Document, as: 'coverImage' },
        { model: ActiveStatus, as: 'status' },
        { model: ArticleLabel, as: 'label' },
        {
          model: ArticleViews,
          as: 'views',
          required: false,
          attributes: ['view_count']
        },
        {
          model: ArticleSettings,
          as: 'settings',
          required: false,
          attributes: ['view_count', 'like_count', 'comment_count']
        },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
    });

    // Format response with views and likes from settings
    const formattedArticles = articles.rows.map(article => {
      const articleData = article.toJSON();
      return {
        ...articleData,
        totalViews: articleData.settings?.view_count || articleData.views?.view_count || 0,
        totalLikes: articleData.settings?.like_count || 0,
        comment_count: articleData.settings?.comment_count || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedArticles,
      pagination: {
        total: articles.count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(articles.count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all articles (public)
exports.getAllArticlesPublic = async (req, res, next) => {
  try {
    const { page = 1, size = 20, sortBy = 'created_on', sortOrder = 'DESC', search, label } = req.query;
    const offset = (page - 1) * size;
    const limit = parseInt(size);

    const whereClause = {
      [Op.or]: [{ status_id: { [Op.ne]: 2 } }, { status_id: { [Op.is]: null } }],
    };

    if (search) {
      whereClause[Op.and] = [
        { [Op.or]: [{ status_id: { [Op.ne]: 2 } }, { status_id: { [Op.is]: null } }] },
        { [Op.or]: [{ title: { [Op.like]: `%${search}%` } }, { brief: { [Op.like]: `%${search}%` } }] },
      ];
    }

    if (label && label !== 'all') {
      const labelRecord = await ArticleLabel.findOne({ where: { name: label } });
      if (labelRecord) whereClause.article_label_id = labelRecord.id;
    }

    const articles = await Article.findAndCountAll({
      where: whereClause,
      include: [
        { model: Category, as: 'category' },
        { model: Document, as: 'coverImage' },
        { model: ActiveStatus, as: 'status' },
        { model: ArticleLabel, as: 'label' },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      data: articles.rows,
      pagination: {
        total: articles.count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(articles.count / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get article by ID
exports.getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category', required: false },
        { model: Document, as: 'coverImage', required: false },
        { model: ActiveStatus, as: 'status', required: false },
        { model: ArticleLabel, as: 'label', required: false },
        { model: db.AccessType, as: 'accessType', required: false },
        { model: db.RobotsMetaTagType, as: 'robotTags', required: false },
        { model: db.SchemaType, as: 'schemaType', required: false },
        { model: db.IndexingStatusType, as: 'indexingStatus', required: false },
      ],
    });

    if (!article) {
      return next(new ErrorResponse('Article not found', 404));
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// Create new article
exports.createArticle = async (req, res, next) => {
  const transaction = await Article.sequelize.transaction();

  try {
    const {
      // Basic fields
      title, brief, content, excerpt, timeToRead,
      // Category and status
      categoryId, labelId, statusId,
      // SEO fields
      urlSlug, metaTitle, metaDescription, focusKeyword, allowIndexing, coverImageAltText,
      // Content management
      isContentLocked, publishDate,
      // Relationships (JSON strings from FormData)
      authorIds, tagIds, relatedPostIds
    } = req.body;

    const userId = req.user ? req.user.id : null;
    let documentId = null;

    // Parse JSON strings from FormData
    const parsedAuthorIds = authorIds ? JSON.parse(authorIds) : [];
    const parsedTagIds = tagIds ? JSON.parse(tagIds) : [];
    const parsedRelatedPostIds = relatedPostIds ? JSON.parse(relatedPostIds) : [];

    // Auto-generate URL slug if not provided
    let slug = urlSlug;
    if (!slug && title) {
      slug = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 100);
    }

    // Auto-calculate reading time if not provided
    let calculatedTimeToRead = timeToRead;
    if (!calculatedTimeToRead && content) {
      const textContent = content.replace(/<[^>]*>/g, ' ');
      const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;
      const minutes = Math.max(1, Math.ceil(wordCount / 225));
      calculatedTimeToRead = `${minutes} min`;
    } else if (!calculatedTimeToRead) {
      calculatedTimeToRead = '1 min';
    }

    // Handle cover image upload
    if (req.file) {
      const { uploadToS3 } = require('../config/s3');
      const uploadResult = await uploadToS3(req.file, 'articles', userId || 1);

      const document = await Document.create({
        name: req.file.originalname,
        uid: uploadResult.file_key,
        url: uploadResult.file_url,
        status_id: 1,
        created_on: new Date(),
        last_updated_on: new Date(),
        created_by: userId,
      }, { transaction });

      documentId = document.id;
    }

    // Create the article with all fields
    const article = await Article.create({
      // Basic fields
      title,
      brief,
      excerpt: excerpt || null,
      content,
      time_to_read: calculatedTimeToRead,

      // SEO fields
      url_slug: slug,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      focus_keyword: focusKeyword || null,
      allow_indexing: allowIndexing !== undefined ? allowIndexing : true,

      // Category and status
      category_id: categoryId || null,
      article_label_id: labelId || null,
      status_id: statusId || 1,

      // Cover image
      document_id: documentId,
      cover_image_alt_text: coverImageAltText || null,

      // Content management
      is_content_locked: isContentLocked || false,
      publish_date: publishDate || null,
      view_count: 0,
      like_count: 0,

      // Audit fields
      created_on: new Date(),
      created_by: userId,
      last_updated_on: new Date(),
      last_updated_by: userId,
    }, { transaction });

    // Add authors (many-to-many)
    if (parsedAuthorIds && parsedAuthorIds.length > 0) {
      const { ArticleAuthor } = require('../models');
      const authorRecords = parsedAuthorIds.map((authorId, index) => ({
        article_id: article.id,
        author_id: parseInt(authorId),
        author_order: index + 1,
        created_on: new Date(),
      }));
      await ArticleAuthor.bulkCreate(authorRecords, { transaction });
    }

    // Add tags - article_tag table uses tag_id foreign key
    if (parsedTagIds && parsedTagIds.length > 0) {
      const { ArticleTag } = require('../models');
      
      const tagRecords = parsedTagIds.map(tagId => ({
        article_id: article.id,
        tag_id: parseInt(tagId),
        created_on: new Date(),
        last_updated_on: new Date(),
      }));
      
      await ArticleTag.bulkCreate(tagRecords, { transaction });
    }

    // Add related posts (many-to-many)
    if (parsedRelatedPostIds && parsedRelatedPostIds.length > 0) {
      const { RelatedArticle } = require('../models');
      const relatedRecords = parsedRelatedPostIds.map((relatedId, index) => ({
        article_id: article.id,
        related_article_id: parseInt(relatedId),
        display_order: index + 1,
        created_on: new Date(),
      }));
      await RelatedArticle.bulkCreate(relatedRecords, { transaction });
    }

    // Create initial revision
    const { ArticleRevision } = require('../models');
    await ArticleRevision.create({
      article_id: article.id,
      title,
      brief,
      content,
      revision_number: 1,
      created_by: userId,
      created_on: new Date(),
      revision_note: 'Initial version',
    }, { transaction });

    // Create SEO analysis placeholder
    const { ArticleSEOAnalysis } = require('../models');
    const textContent = content ? content.replace(/<[^>]*>/g, ' ') : '';
    const wordCount = textContent.trim().split(/\s+/).filter(w => w.length > 0).length;

    await ArticleSEOAnalysis.create({
      article_id: article.id,
      seo_score: 0,
      readability_score: 0,
      keyword_density: 0,
      has_meta_description: !!metaDescription,
      has_focus_keyword: !!focusKeyword,
      has_alt_texts: !!coverImageAltText,
      word_count: wordCount,
      recommendations: JSON.stringify([]),
      analyzed_on: new Date(),
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    // Fetch the complete article with all associations
    const { Operator, Tag } = require('../models');
    const createdArticle = await Article.findByPk(article.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Document, as: 'coverImage', attributes: ['id', 'name', 'url', 'uid'] },
        { model: ArticleLabel, as: 'label', attributes: ['id', 'name'] },
        { model: ActiveStatus, as: 'status', attributes: ['id', 'name'] },
        {
          model: Operator,
          as: 'authors',
          attributes: ['id', 'first_name', 'last_name', 'email'],
          through: { attributes: ['author_order'] }
        },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name', 'slug'],
          through: { attributes: [] }
        },
        {
          model: Article,
          as: 'relatedPosts',
          attributes: ['id', 'title', 'brief'],
          through: { attributes: ['display_order'] }
        },
        { model: Operator, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully with all relationships',
      data: createdArticle
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Create article error:', error);
    next(error);
  }
};

// Update article
exports.updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) {
      return next(new ErrorResponse('Article not found', 404));
    }

    const { title, brief, content, timeToRead, categoryId, labelId, statusId } = req.body;
    let documentId = article.document_id;

    // Auto-calculate reading time if not provided but content is updated
    let calculatedTimeToRead = timeToRead;
    const updatedContent = content || article.content;
    if (!calculatedTimeToRead && updatedContent) {
      // Remove HTML tags
      const textContent = updatedContent.replace(/<[^>]*>/g, ' ');
      // Count words
      const words = textContent.trim().split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;
      // Calculate minutes (225 words per minute)
      const minutes = Math.max(1, Math.ceil(wordCount / 225));
      calculatedTimeToRead = `${minutes} min`;
    } else if (!calculatedTimeToRead) {
      calculatedTimeToRead = article.time_to_read || '1 min';
    }

    // Handle file upload
    if (req.file) {
      const { uploadToS3 } = require('../config/s3');
      const uploadResult = await uploadToS3(req.file, 'articles', req.user ? req.user.id : 1);

      const document = await Document.create({
        name: req.file.originalname,
        uid: uploadResult.file_key,
        url: uploadResult.file_url,
        status_id: 1,
        created_on: new Date(),
        last_updated_on: new Date(),
        created_by: null,
      });
      documentId = document.id;
    }

    await article.update({
      title: title || article.title,
      brief: brief || article.brief,
      content: content || article.content,
      time_to_read: calculatedTimeToRead,
      category_id: categoryId || article.category_id,
      document_id: documentId,
      article_label_id: labelId || article.article_label_id,
      status_id: statusId || article.status_id,
      last_updated_on: new Date(),
    });

    res.status(200).json({ success: true, message: 'Article updated successfully', data: article });
  } catch (error) {
    next(error);
  }
};

// Delete article (soft delete - sets status_id to 2)
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return next(new ErrorResponse('Article not found', 404));
    }

    if (article.status_id === 2) {
      return next(new ErrorResponse('Article already deleted', 400));
    }

    await article.update({
      status_id: 2,
      last_updated_on: new Date(),
    });

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
      data: { id: article.id, status_id: 2 },
    });
  } catch (error) {
    next(error);
  }
};

// Bulk actions for articles
exports.bulkAction = async (req, res, next) => {
  try {
    const { action, articleIds, categoryId } = req.body;

    if (!Array.isArray(articleIds) || articleIds.length === 0) {
      return next(new ErrorResponse('Article IDs must be provided as an array', 400));
    }

    let result;
    switch (action) {
      case 'delete':
        result = await Article.update(
          { status_id: 2, last_updated_on: new Date() },
          { where: { id: articleIds, status_id: { [Op.ne]: 2 } } }
        );
        break;
      case 'publish':
        result = await Article.update({ status_id: 1, last_updated_on: new Date() }, { where: { id: articleIds } });
        break;
      case 'unpublish':
        result = await Article.update({ status_id: 3, last_updated_on: new Date() }, { where: { id: articleIds } });
        break;
      case 'moveCategory':
        if (!categoryId) {
          return next(new ErrorResponse('Category ID is required for moveCategory action', 400));
        }
        result = await Article.update({ category_id: categoryId, last_updated_on: new Date() }, { where: { id: articleIds } });
        break;
      default:
        return next(new ErrorResponse('Invalid action', 400));
    }

    res.status(200).json({
      success: true,
      message: `Bulk action '${action}' completed successfully`,
      data: { affectedRows: result },
    });
  } catch (error) {
    next(error);
  }
};

// Get article analytics (simplified)
exports.getArticleAnalytics = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id, {
      include: [
        { model: Category, as: 'category', attributes: ['name'] },
        { model: Document, as: 'coverImage', attributes: ['url'] },
      ],
    });

    if (!article) {
      return next(new ErrorResponse('Article not found', 404));
    }

    // Mock analytics since article_views table structure is simple
    res.status(200).json({
      success: true,
      data: {
        article,
        analytics: {
          totalViews: 0,
          recentViews: 0,
          period: 30,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


// Get authors for dropdown
exports.getAuthors = async (req, res, next) => {
  try {
    const { Operator, EntityOperatorRoleMapping } = require('../models');

    const authors = await Operator.findAll({
      attributes: ['id', 'first_name', 'last_name', 'email'],
      include: [{
        model: EntityOperatorRoleMapping,
        as: 'roleMappings',
        required: true,
        where: { active_status_id: 1 }
      }]
    });

    res.status(200).json({
      success: true,
      data: authors.map(author => ({
        id: author.id,
        name: `${author.first_name} ${author.last_name}`,
        email: author.email
      }))
    });
  } catch (error) {
    next(error);
  }
};

// Get related posts for an article
exports.getRelatedPosts = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [relatedPosts] = await db.sequelize.query(`
      SELECT 
        a.id,
        a.title,
        a.brief,
        a.url_slug,
        d.url as cover_image_url,
        c.name as category_name,
        ra.display_order
      FROM related_article ra
      INNER JOIN article a ON ra.related_article_id = a.id
      LEFT JOIN document d ON a.document_id = d.id
      LEFT JOIN category c ON a.category_id = c.id
      WHERE ra.article_id = :articleId
      ORDER BY ra.display_order ASC
    `, {
      replacements: { articleId: id }
    });

    res.status(200).json({
      success: true,
      data: relatedPosts
    });
  } catch (error) {
    next(error);
  }
};

// Update related posts for an article
exports.updateRelatedPosts = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id } = req.params;
    const { relatedPostIds } = req.body;

    if (!Array.isArray(relatedPostIds)) {
      return next(new ErrorResponse('relatedPostIds must be an array', 400));
    }

    // Delete existing related posts
    await db.sequelize.query(
      'DELETE FROM related_article WHERE article_id = ?',
      { replacements: [id], transaction }
    );

    // Insert new related posts
    if (relatedPostIds.length > 0) {
      const values = relatedPostIds.map((relatedId, index) =>
        `(${id}, ${relatedId}, ${index + 1}, NOW())`
      ).join(',');

      await db.sequelize.query(
        `INSERT INTO related_article (article_id, related_article_id, display_order, created_on) 
         VALUES ${values}`,
        { transaction }
      );
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Related posts updated successfully'
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Get article revisions
exports.getArticleRevisions = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [revisions] = await db.sequelize.query(`
      SELECT 
        ar.*,
        o.first_name,
        o.last_name,
        o.email
      FROM article_revisions ar
      LEFT JOIN operator o ON ar.created_by = o.id
      WHERE ar.article_id = :articleId
      ORDER BY ar.revision_number DESC
    `, {
      replacements: { articleId: id }
    });

    res.status(200).json({
      success: true,
      data: revisions
    });
  } catch (error) {
    next(error);
  }
};

// Restore article revision
exports.restoreRevision = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { id, revisionId } = req.params;
    const userId = req.user ? req.user.id : null;

    // Get the revision
    const [[revision]] = await db.sequelize.query(
      'SELECT * FROM article_revisions WHERE id = ? AND article_id = ?',
      { replacements: [revisionId, id] }
    );

    if (!revision) {
      return next(new ErrorResponse('Revision not found', 404));
    }

    // Update article with revision content
    await db.sequelize.query(
      `UPDATE article 
       SET title = ?, brief = ?, content = ?, last_updated_on = NOW(), last_updated_by = ?
       WHERE id = ?`,
      { replacements: [revision.title, revision.brief, revision.content, userId, id], transaction }
    );

    // Create new revision for this restore
    const [[{ maxRevision }]] = await db.sequelize.query(
      'SELECT MAX(revision_number) as maxRevision FROM article_revisions WHERE article_id = ?',
      { replacements: [id] }
    );

    await db.sequelize.query(
      `INSERT INTO article_revisions (article_id, title, brief, content, revision_number, created_by, created_on, revision_note)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)`,
      {
        replacements: [
          id,
          revision.title,
          revision.brief,
          revision.content,
          (maxRevision || 0) + 1,
          userId,
          `Restored from revision #${revision.revision_number}`
        ],
        transaction
      }
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Revision restored successfully'
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Analyze SEO for an article
exports.analyzeSEO = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get article
    const [[article]] = await db.sequelize.query(
      'SELECT * FROM article WHERE id = ?',
      { replacements: [id] }
    );

    if (!article) {
      return next(new ErrorResponse('Article not found', 404));
    }

    // Calculate SEO metrics
    const textContent = article.content ? article.content.replace(/<[^>]*>/g, ' ') : '';
    const words = textContent.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Calculate keyword density
    let keywordDensity = 0;
    if (article.focus_keyword && wordCount > 0) {
      const keyword = article.focus_keyword.toLowerCase();
      const keywordCount = textContent.toLowerCase().split(keyword).length - 1;
      keywordDensity = ((keywordCount / wordCount) * 100).toFixed(2);
    }

    // Calculate SEO score (0-100)
    let seoScore = 0;
    const recommendations = [];

    // Title (20 points)
    if (article.title && article.title.length >= 30 && article.title.length <= 60) {
      seoScore += 20;
    } else if (article.title) {
      seoScore += 10;
      if (article.title.length < 30) {
        recommendations.push({ type: 'warning', message: 'Title is too short. Aim for 30-60 characters.' });
      } else {
        recommendations.push({ type: 'warning', message: 'Title is too long. Keep it under 60 characters.' });
      }
    }

    // Meta description (20 points)
    if (article.meta_description && article.meta_description.length >= 120 && article.meta_description.length <= 160) {
      seoScore += 20;
    } else if (article.meta_description) {
      seoScore += 10;
      recommendations.push({ type: 'warning', message: 'Meta description should be 120-160 characters.' });
    } else {
      recommendations.push({ type: 'error', message: 'Add a meta description for better SEO.' });
    }

    // Focus keyword (20 points)
    if (article.focus_keyword && keywordDensity >= 0.5 && keywordDensity <= 2.5) {
      seoScore += 20;
    } else if (article.focus_keyword) {
      seoScore += 10;
      if (keywordDensity < 0.5) {
        recommendations.push({ type: 'info', message: `Keyword density is low (${keywordDensity}%). Aim for 0.5-2.5%.` });
      } else {
        recommendations.push({ type: 'warning', message: `Keyword density is high (${keywordDensity}%). Keep it under 2.5%.` });
      }
    } else {
      recommendations.push({ type: 'warning', message: 'Add a focus keyword for SEO optimization.' });
    }

    // URL slug (10 points)
    if (article.url_slug && article.url_slug.length <= 75) {
      seoScore += 10;
    } else if (article.url_slug) {
      seoScore += 5;
      recommendations.push({ type: 'info', message: 'URL slug is long. Keep it under 75 characters.' });
    }

    // Alt text (10 points)
    if (article.cover_image_alt_text) {
      seoScore += 10;
    } else {
      recommendations.push({ type: 'warning', message: 'Add alt text to cover image for accessibility and SEO.' });
    }

    // Content length (20 points)
    if (wordCount >= 300) {
      seoScore += 20;
    } else if (wordCount >= 150) {
      seoScore += 10;
      recommendations.push({ type: 'info', message: `Content is short (${wordCount} words). Aim for 300+ words.` });
    } else {
      recommendations.push({ type: 'warning', message: `Content is very short (${wordCount} words). Add more content.` });
    }

    // Update SEO analysis table
    await db.sequelize.query(`
      INSERT INTO article_seo_analysis 
        (article_id, seo_score, readability_score, keyword_density, has_meta_description, has_focus_keyword, has_alt_texts, word_count, recommendations, analyzed_on)
      VALUES 
        (?, ?, 0, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        seo_score = VALUES(seo_score),
        keyword_density = VALUES(keyword_density),
        has_meta_description = VALUES(has_meta_description),
        has_focus_keyword = VALUES(has_focus_keyword),
        has_alt_texts = VALUES(has_alt_texts),
        word_count = VALUES(word_count),
        recommendations = VALUES(recommendations),
        analyzed_on = NOW()
    `, {
      replacements: [
        id,
        seoScore,
        parseFloat(keywordDensity),
        !!article.meta_description,
        !!article.focus_keyword,
        !!article.cover_image_alt_text,
        wordCount,
        JSON.stringify(recommendations)
      ]
    });

    res.status(200).json({
      success: true,
      data: {
        seoScore,
        keywordDensity: parseFloat(keywordDensity),
        wordCount,
        recommendations
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get SEO score for an article
exports.getSEOScore = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [[analysis]] = await db.sequelize.query(
      'SELECT * FROM article_seo_analysis WHERE article_id = ?',
      { replacements: [id] }
    );

    if (!analysis) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No SEO analysis found. Run analysis first.'
      });
    }

    // Parse recommendations if it's a string
    if (typeof analysis.recommendations === 'string') {
      try {
        analysis.recommendations = JSON.parse(analysis.recommendations);
      } catch (e) {
        analysis.recommendations = [];
      }
    }

    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
};
