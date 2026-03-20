const db = require('../models');
const { Op } = require('sequelize');
const ErrorResponse = require('../utils/errorResponse');

// Get comments for an article
exports.getArticleComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status = 'approved', page = 1, size = 20 } = req.query;

    const offset = (page - 1) * size;
    const limit = parseInt(size);

    const [comments] = await db.sequelize.query(`
      SELECT 
        c.*,
        cst.name as status,
        o.first_name,
        o.last_name,
        o.email as user_email
      FROM article_comments c
      LEFT JOIN comment_status_type cst ON c.comment_status_id = cst.id
      LEFT JOIN operator o ON c.user_id = o.id
      WHERE c.article_id = :articleId
        ${status !== 'all' ? 'AND cst.name = :status' : ''}
      ORDER BY c.created_at DESC
      LIMIT :limit OFFSET :offset
    `, {
      replacements: {
        articleId: id,
        status: status !== 'all' ? status : null,
        limit,
        offset
      }
    });

    const [[{ total }]] = await db.sequelize.query(`
      SELECT COUNT(*) as total
      FROM article_comments c
      LEFT JOIN comment_status_type cst ON c.comment_status_id = cst.id
      WHERE c.article_id = :articleId
        ${status !== 'all' ? 'AND cst.name = :status' : ''}
    `, {
      replacements: {
        articleId: id,
        status: status !== 'all' ? status : null
      }
    });

    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        total: parseInt(total),
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create a new comment
exports.createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, author_name, author_email, parent_comment_id } = req.body;
    const user_id = req.user ? req.user.id : null;

    // Validation
    if (!content || !author_name || !author_email) {
      return next(new ErrorResponse('Content, name, and email are required', 400));
    }

    // Check if article exists
    const [[article]] = await db.sequelize.query(
      'SELECT id FROM article WHERE id = ?',
      { replacements: [id] }
    );

    if (!article) {
      return next(new ErrorResponse('Article not found', 404));
    }

    // Look up comment_status_id for 'pending'
    const [[pendingStatus]] = await db.sequelize.query(
      `SELECT id FROM comment_status_type WHERE name = 'pending' LIMIT 1`
    );
    const pendingStatusId = pendingStatus ? pendingStatus.id : 1;

    // Create comment
    const [result] = await db.sequelize.query(`
      INSERT INTO article_comments 
        (article_id, user_id, parent_comment_id, author_name, author_email, content, comment_status_id, ip_address, user_agent)
      VALUES 
        (:article_id, :user_id, :parent_comment_id, :author_name, :author_email, :content, :comment_status_id, :ip_address, :user_agent)
    `, {
      replacements: {
        article_id: id,
        user_id,
        parent_comment_id: parent_comment_id || null,
        author_name,
        author_email,
        content,
        comment_status_id: pendingStatusId,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('user-agent')
      }
    });

    // Fetch the created comment
    const [[comment]] = await db.sequelize.query(
      'SELECT * FROM article_comments WHERE id = ?',
      { replacements: [result] }
    );

    res.status(201).json({
      success: true,
      message: 'Comment submitted successfully. It will be visible after moderation.',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// Update comment status (moderate)
exports.moderateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'spam', 'pending'].includes(status)) {
      return next(new ErrorResponse('Invalid status', 400));
    }

    // Look up the comment_status_id from master table
    const [[statusRecord]] = await db.sequelize.query(
      `SELECT id FROM comment_status_type WHERE name = ? LIMIT 1`,
      { replacements: [status] }
    );

    if (!statusRecord) {
      return next(new ErrorResponse(`Status '${status}' not found in master table`, 400));
    }

    await db.sequelize.query(
      'UPDATE article_comments SET comment_status_id = ?, updated_at = NOW() WHERE id = ?',
      { replacements: [statusRecord.id, id] }
    );

    res.status(200).json({
      success: true,
      message: `Comment ${status} successfully`
    });
  } catch (error) {
    next(error);
  }
};

// Delete comment
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    await db.sequelize.query(
      'DELETE FROM article_comments WHERE id = ?',
      { replacements: [id] }
    );

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all comments (admin)
exports.getAllComments = async (req, res, next) => {
  try {
    const { status, page = 1, size = 20, search } = req.query;
    const offset = (page - 1) * size;
    const limit = parseInt(size);

    let whereClause = '';
    const replacements = { limit, offset };

    if (status && status !== 'all') {
      whereClause += ' AND cst.name = :status';
      replacements.status = status;
    }

    if (search) {
      whereClause += ' AND (c.content LIKE :search OR c.author_name LIKE :search OR c.author_email LIKE :search)';
      replacements.search = `%${search}%`;
    }

    const [comments] = await db.sequelize.query(`
      SELECT 
        c.*,
        cst.name as status,
        a.title as article_title,
        o.first_name,
        o.last_name
      FROM article_comments c
      LEFT JOIN comment_status_type cst ON c.comment_status_id = cst.id
      LEFT JOIN article a ON c.article_id = a.id
      LEFT JOIN operator o ON c.user_id = o.id
      WHERE 1=1 ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT :limit OFFSET :offset
    `, { replacements });

    const [[{ total }]] = await db.sequelize.query(`
      SELECT COUNT(*) as total
      FROM article_comments c
      LEFT JOIN comment_status_type cst ON c.comment_status_id = cst.id
      WHERE 1=1 ${whereClause}
    `, { replacements: { ...replacements, limit: undefined, offset: undefined } });

    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        total: parseInt(total),
        page: parseInt(page),
        size: limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Bulk moderate comments
exports.bulkModerate = async (req, res, next) => {
  try {
    const { commentIds, status } = req.body;

    if (!Array.isArray(commentIds) || commentIds.length === 0) {
      return next(new ErrorResponse('Comment IDs array is required', 400));
    }

    if (!['approved', 'rejected', 'spam'].includes(status)) {
      return next(new ErrorResponse('Invalid status', 400));
    }

    // Look up the comment_status_id from master table
    const [[statusRecord]] = await db.sequelize.query(
      `SELECT id FROM comment_status_type WHERE name = ? LIMIT 1`,
      { replacements: [status] }
    );

    if (!statusRecord) {
      return next(new ErrorResponse(`Status '${status}' not found in master table`, 400));
    }

    const placeholders = commentIds.map(() => '?').join(',');
    await db.sequelize.query(
      `UPDATE article_comments SET comment_status_id = ?, updated_at = NOW() WHERE id IN (${placeholders})`,
      { replacements: [statusRecord.id, ...commentIds] }
    );

    res.status(200).json({
      success: true,
      message: `${commentIds.length} comments ${status} successfully`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
