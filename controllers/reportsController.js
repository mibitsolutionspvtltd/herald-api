const {
  Article,

  Operator,
  EntityOperatorRoleMapping,
  BackOfficeUsers,
  ArticleViews,
  Contacts,
  Category,
  Document,
  FileUpload,
  DeviceRegistration,
  UserVerificationToken
} = require('../models');
const { Op } = require('sequelize');
const ErrorResponse = require('../utils/errorResponse');

// Generate content performance report
exports.generateContentReport = async (req, res, next) => {
  try {
    const { startDate, endDate, categoryId, format = 'json' } = req.query;

    const whereClause = {};
    if (startDate && endDate) {
      whereClause.created_on = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    if (categoryId) {
      whereClause.category_id = categoryId;
    }

    const articles = await Article.findAll({
      where: whereClause,
      include: [
        { model: Category, as: 'category', attributes: ['name'] },
        { model: ArticleViews, as: 'views', attributes: [] },
        { model: Document, as: 'coverImage', attributes: ['url'] }
      ],
      attributes: [
        'id',
        'title',
        'created_on',
        'time_to_read',
        [Article.sequelize.fn('COUNT', Article.sequelize.col('views.id')), 'viewCount']
      ],
      group: ['Article.id', 'Article.title', 'Article.created_on', 'Article.time_to_read', 'category.id', 'category.name', 'coverImage.id', 'coverImage.url'],
      order: [[Article.sequelize.fn('COUNT', Article.sequelize.col('views.id')), 'DESC']]
    });



    const totalViews = await ArticleViews.count({
      include: [{
        model: Article,
        as: 'article',
        where: whereClause,
        required: true
      }]
    });

    const reportData = {
      period: { startDate, endDate },
      summary: {
        totalArticles: articles.length,
        totalViews,
        avgViewsPerArticle: articles.length > 0 ? Math.round(totalViews / articles.length) : 0
      },
      articles
    };

    if (format === 'csv') {
      // Generate CSV format
      const csv = generateCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="content-report.csv"');
      return res.send(csv);
    }

    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    next(error);
  }
};

// Generate user activity report
exports.generateUserReport = async (req, res, next) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    const whereClause = {};
    if (startDate && endDate) {
      whereClause.created_on = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const operators = await Operator.findAll({
      where: whereClause,
      attributes: [
        'id',
        'first_name',
        'middle_name',
        'last_name',
        'email',
        'created_on'
      ],
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          where: { active_status_id: 1 },
          required: false
        }
      ],
      order: [['created_on', 'DESC']]
    });

    const operatorStats = await EntityOperatorRoleMapping.count({
      where: { active_status_id: 1 }
    });

    const reportData = {
      period: { startDate, endDate },
      summary: {
        totalOperators: operators.length,
        activeOperators: operatorStats
      },
      operators
    };

    if (format === 'csv') {
      const csv = generateUserCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="user-report.csv"');
      return res.send(csv);
    }

    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    next(error);
  }
};

// Generate system report
exports.generateSystemReport = async (req, res, next) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    const whereClause = {};
    if (startDate && endDate) {
      whereClause.created_on = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Simplified system report - only count basic entities
    const [
      totalArticles,
      totalCategories,
      totalOperators,
      totalContacts
    ] = await Promise.all([
      Article.count({ where: whereClause }),
      Category.count(),
      Operator.count({ where: whereClause }),
      Contacts.count()
    ]);

    const reportData = {
      period: { startDate, endDate },
      summary: {
        totalArticles,
        totalCategories,
        totalOperators,
        totalContacts
      }
    };

    if (format === 'csv') {
      const csv = generateSystemCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="system-report.csv"');
      return res.send(csv);
    }

    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate CSV
function generateCSV(data) {
  const headers = ['ID', 'Title', 'Category', 'Created Date', 'Views', 'Time to Read'];
  const rows = data.articles.map(article => [
    article.id,
    `"${article.title}"`,
    article.category ? article.category.name : 'N/A',
    article.created_on,
    article.dataValues.viewCount,
    article.time_to_read || 'N/A'
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

function generateUserCSV(data) {
  const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Created Date'];
  const rows = data.operators.map(operator => [
    operator.id,
    `"${operator.first_name || ''}"`,
    `"${operator.last_name || ''}"`,
    operator.email,
    operator.created_on
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

function generateSystemCSV(data) {
  const headers = ['Metric', 'Value'];
  const rows = [
    ['Total Articles', data.summary.totalArticles],
    ['Total Categories', data.summary.totalCategories],
    ['Total Operators', data.summary.totalOperators],
    ['Total Contacts', data.summary.totalContacts]
  ];

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}
