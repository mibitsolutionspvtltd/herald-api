const { Tag, ArticleTag, Article, sequelize } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');

// Get all tags
exports.getAllTags = async (req, res, next) => {
  try {
    const { search, page = 1, size = 100 } = req.query;
    const offset = (page - 1) * size;
    const limit = parseInt(size);

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { slug: { [Op.like]: `%${search}%` } }
      ];
    }

    const tags = await Tag.findAndCountAll({
      where: whereClause,
      order: [['name', 'ASC']],
      limit,
      offset
    });

    res.status(200).json({
      success: true,
      data: tags.rows,
      pagination: {
        total: tags.count,
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(tags.count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get tag by ID
exports.getTagById = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return next(new ErrorResponse('Tag not found', 404));
    }

    res.status(200).json({
      success: true,
      data: tag
    });
  } catch (error) {
    next(error);
  }
};

// Create new tag
exports.createTag = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return next(new ErrorResponse('Tag name is required', 400));
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check if tag already exists
    const existingTag = await Tag.findOne({
      where: {
        [Op.or]: [
          { name: name.trim() },
          { slug }
        ]
      }
    });

    if (existingTag) {
      return next(new ErrorResponse('Tag already exists', 409));
    }

    const tag = await Tag.create({
      name: name.trim(),
      slug,
      created_at: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      data: tag
    });
  } catch (error) {
    next(error);
  }
};

// Update tag
exports.updateTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return next(new ErrorResponse('Tag not found', 404));
    }

    const { name } = req.body;

    if (name && name.trim()) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      
      // Check if new name/slug conflicts with another tag
      const existingTag = await Tag.findOne({
        where: {
          id: { [Op.ne]: req.params.id },
          [Op.or]: [
            { name: name.trim() },
            { slug }
          ]
        }
      });

      if (existingTag) {
        return next(new ErrorResponse('Tag name already exists', 409));
      }

      tag.name = name.trim();
      tag.slug = slug;
    }

    await tag.save();

    res.status(200).json({
      success: true,
      message: 'Tag updated successfully',
      data: tag
    });
  } catch (error) {
    next(error);
  }
};

// Delete tag
exports.deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findByPk(req.params.id);

    if (!tag) {
      return next(new ErrorResponse('Tag not found', 404));
    }

    // Delete all article-tag associations
    await ArticleTag.destroy({
      where: { tag_id: req.params.id }
    });

    await tag.destroy();

    res.status(200).json({
      success: true,
      message: 'Tag deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add tags to article
exports.addTagsToArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { tagIds } = req.body;

    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      return next(new ErrorResponse('Tag IDs must be provided as an array', 400));
    }

    // Verify article exists
    const article = await Article.findByPk(articleId);
    if (!article) {
      return next(new ErrorResponse('Article not found', 404));
    }

    // Verify all tags exist
    const tags = await Tag.findAll({
      where: { id: tagIds }
    });

    if (tags.length !== tagIds.length) {
      return next(new ErrorResponse('One or more tags not found', 404));
    }

    // Remove existing tags
    await ArticleTag.destroy({
      where: { article_id: articleId }
    });

    // Add new tags
    const articleTags = tagIds.map(tagId => ({
      article_id: articleId,
      tag_id: tagId,
      created_at: new Date()
    }));

    await ArticleTag.bulkCreate(articleTags);

    res.status(200).json({
      success: true,
      message: 'Tags added to article successfully',
      data: { articleId, tagIds }
    });
  } catch (error) {
    next(error);
  }
};

// Remove tag from article
exports.removeTagFromArticle = async (req, res, next) => {
  try {
    const { articleId, tagId } = req.params;

    const result = await ArticleTag.destroy({
      where: {
        article_id: articleId,
        tag_id: tagId
      }
    });

    if (result === 0) {
      return next(new ErrorResponse('Tag association not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Tag removed from article successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get tags for an article
exports.getArticleTags = async (req, res, next) => {
  try {
    const { articleId } = req.params;

    const articleTags = await ArticleTag.findAll({
      where: { article_id: articleId },
      include: [{
        model: Tag,
        as: 'tag',
        attributes: ['id', 'name', 'slug']
      }]
    });

    const tags = articleTags.map(at => at.tag);

    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    next(error);
  }
};

// Get popular tags
exports.getPopularTags = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    // Simplified query - just return all tags for now
    // Can be enhanced later with actual article count
    const popularTags = await Tag.findAll({
      attributes: ['id', 'name', 'slug'],
      order: [['name', 'ASC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: popularTags
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
