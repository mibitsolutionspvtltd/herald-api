const {
  Operator,
  Article,
  Category,
  Courses,
  Universities,
  Contacts,
  EntityOperatorRoleMapping,
  RoleType,
  BackOfficeUsers,
  FileUpload,
  ArticleViews
} = require('../models');
const { Op } = require('sequelize');

// Get ADMIN role type ID for counting admin users
const getAdminRoleTypeId = async () => {
  const adminRole = await RoleType.findOne({
    where: {
      code: 'ADMIN',
      is_enable: true
    }
  });
  return adminRole ? adminRole.id : null;
};

// Get role-based dashboard data
const getDashboardData = async (req, res) => {
  try {
    const user = req.user;

    // Handle permissions - check if it's a string or array
    let userPermissions = [];
    if (typeof user.permissions === 'string') {
      userPermissions = user.permissions.split(',').map(p => p.trim()).filter(p => p);
    } else if (Array.isArray(user.permissions)) {
      userPermissions = user.permissions;
    }

    // Admin has all permissions
    const isAdmin = user.type === 'admin' || user.role === 'ADMIN' || userPermissions.includes('ALL');

    // Check if user has specific permissions (admins get everything)
    const canViewUsers = isAdmin || userPermissions.some(p => p.includes('users') || p.includes('VIEW_USER'));
    const canViewContent = isAdmin || userPermissions.some(p => p.includes('articles') || p.includes('VIEW_ARTICLE'));
    const canViewAnalytics = isAdmin || userPermissions.some(p => p.includes('analytics') || p.includes('courses') || p.includes('universities') || p.includes('VIEW_ANALYTICS'));
    const canManageSystem = isAdmin || userPermissions.some(p => p.includes('system') || p.includes('MANAGE_SYSTEM'));

    console.log('Dashboard Permissions:', {
      isAdmin,
      canViewUsers,
      canViewContent,
      canViewAnalytics,
      canManageSystem,
      userRole: user.role,
      userType: user.type,
      permissions: userPermissions
    });

    const dashboardData = {
      user: {
        id: user.id,
        name: `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim() || user.email,
        email: user.email,
        role: user.role || user.primaryRole?.name || 'User',
        permissions: userPermissions
      },
      overview: {},
      recentActivity: [],
      quickStats: {},
      permissions: {
        canViewUsers,
        canViewContent,
        canViewAnalytics,
        canManageSystem
      }
    };

    // Get overview statistics based on permissions (with error handling)
    if (canViewContent) {
      try {
        // Count all records (not just active ones) for dashboard overview
        const [articleCount, categoryCount] = await Promise.all([
          Article.count().catch(() => 0),
          Category.count().catch(() => 0)
        ]);

        console.log('Content counts:', { articleCount, categoryCount });

        dashboardData.overview.totalArticles = articleCount;
        dashboardData.overview.totalCategories = categoryCount;
        dashboardData.overview.totalContent = articleCount;
      } catch (error) {
        console.error('Error fetching content stats:', error.message);
        dashboardData.overview.totalArticles = 0;
        dashboardData.overview.totalCategories = 0;
        dashboardData.overview.totalContent = 0;
      }
    }

    // Always fetch basic user count for all authenticated users (dashboard overview)
    // All users are now in Operator table - admins are operators with ADMIN role
    try {
      const operatorCount = await Operator.count().catch(() => 0);

      // Count admin users (operators with ADMIN role)
      const adminRoleId = await getAdminRoleTypeId();
      let adminCount = 0;
      if (adminRoleId) {
        adminCount = await EntityOperatorRoleMapping.count({
          where: {
            role_type_id: adminRoleId,
            active_status_id: 1
          }
        }).catch(() => 0);
      }

      dashboardData.overview.totalOperators = operatorCount;
      dashboardData.overview.totalAdmins = adminCount;
      dashboardData.overview.totalUsers = operatorCount;

      console.log('User counts:', { operatorCount, adminCount, totalUsers: operatorCount });
    } catch (error) {
      console.error('Error fetching user stats:', error.message);
      dashboardData.overview.totalUsers = 0;
      dashboardData.overview.totalOperators = 0;
      dashboardData.overview.totalAdmins = 0;
    }

    if (canViewAnalytics || isAdmin) {
      try {
        console.log('Fetching analytics stats...');

        // Use correct model names (Courses and Universities are plural)
        const courseCount = await Courses.count().catch(err => {
          console.error('Course count error:', err.message);
          return 0;
        });

        const universityCount = await Universities.count().catch(err => {
          console.error('University count error:', err.message);
          return 0;
        });

        const contactCount = await Contacts.count().catch(err => {
          console.error('Contact count error:', err.message);
          return 0;
        });

        console.log('Analytics counts:', { courseCount, universityCount, contactCount });

        dashboardData.overview.totalCourses = courseCount;
        dashboardData.overview.totalUniversities = universityCount;
        dashboardData.overview.totalContacts = contactCount;
        dashboardData.overview.totalViews = 0; // ArticleViews might not exist
      } catch (error) {
        console.error('Error fetching analytics stats:', error.message, error.stack);
        dashboardData.overview.totalCourses = 0;
        dashboardData.overview.totalUniversities = 0;
        dashboardData.overview.totalContacts = 0;
      }
    }

    if (canManageSystem) {
      try {
        const fileCount = await FileUpload.count().catch(() => 0);
        const storageSize = await FileUpload.sum('file_size').catch(() => 0);

        dashboardData.overview.totalFiles = fileCount;
        dashboardData.overview.totalStorage = storageSize || 0;
      } catch (error) {
        console.error('Error fetching system stats:', error.message);
        dashboardData.overview.totalFiles = 0;
        dashboardData.overview.totalStorage = 0;
      }
    }

    // Get recent activity based on permissions (with error handling)
    const recentActivity = [];

    if (canViewContent) {
      try {
        // Recent articles (all, not just active)
        const recentArticles = await Article.findAll({
          order: [['created_on', 'DESC']],
          limit: 3,
          attributes: ['id', 'title', 'created_on']
        }).catch(() => []);

        recentArticles.forEach(article => {
          if (article.title) {
            recentActivity.push({
              id: `article-${article.id}`,
              type: 'article',
              title: 'Article',
              description: article.title,
              timestamp: article.created_on,
              icon: 'document'
            });
          }
        });
      } catch (error) {
        console.error('Error fetching content activity:', error.message);
      }
    }

    if (canViewUsers) {
      try {
        // Recent operators
        const recentOperators = await Operator.findAll({
          order: [['created_on', 'DESC']],
          limit: 2,
          attributes: ['id', 'first_name', 'last_name', 'email', 'created_on']
        }).catch(() => []);

        recentOperators.forEach(operator => {
          recentActivity.push({
            id: `operator-${operator.id}`,
            type: 'user',
            title: 'New User Registered',
            description: `${operator.first_name} ${operator.last_name}`,
            email: operator.email,
            timestamp: operator.created_on,
            icon: 'user'
          });
        });
      } catch (error) {
        console.error('Error fetching user activity:', error.message);
      }
    }

    if (canViewAnalytics) {
      try {
        // Recent contacts
        const recentContacts = await Contacts.findAll({
          order: [['created_at', 'DESC']],
          limit: 2,
          attributes: ['id', 'name', 'email', 'message', 'created_at']
        }).catch(() => []);

        recentContacts.forEach(contact => {
          recentActivity.push({
            id: `contact-${contact.id}`,
            type: 'contact',
            title: 'New Contact Message',
            description: `Message from ${contact.name}`,
            email: contact.email,
            timestamp: contact.created_at,
            icon: 'mail'
          });
        });
      } catch (error) {
        console.error('Error fetching contact activity:', error.message);
      }
    }

    // Sort recent activity by timestamp
    try {
      recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      dashboardData.recentActivity = recentActivity.slice(0, 10);
    } catch (error) {
      dashboardData.recentActivity = [];
    }

    // Calculate quick stats based on role (with error handling)
    if (canViewContent) {
      try {
        // Get content growth (last 30 days vs previous 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const [recentArticles, previousArticles] = await Promise.all([
          Article.count({ where: { created_on: { [Op.gte]: thirtyDaysAgo } } }).catch(() => 0),
          Article.count({ where: { created_on: { [Op.between]: [sixtyDaysAgo, thirtyDaysAgo] } } }).catch(() => 0)
        ]);

        dashboardData.quickStats.articleGrowth = previousArticles > 0
          ? Math.round(((recentArticles - previousArticles) / previousArticles) * 100)
          : (recentArticles > 0 ? 100 : 0);
      } catch (error) {
        console.error('Error calculating content growth:', error.message);
        dashboardData.quickStats.articleGrowth = 0;
      }
    }

    // Always calculate user growth for all authenticated users (dashboard overview)
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const [recentUsers, previousUsers] = await Promise.all([
        Operator.count({ where: { created_on: { [Op.gte]: thirtyDaysAgo } } }).catch(() => 0),
        Operator.count({ where: { created_on: { [Op.between]: [sixtyDaysAgo, thirtyDaysAgo] } } }).catch(() => 0)
      ]);

      dashboardData.quickStats.userGrowth = previousUsers > 0
        ? Math.round(((recentUsers - previousUsers) / previousUsers) * 100)
        : (recentUsers > 0 ? 100 : 0);
    } catch (error) {
      console.error('Error calculating user growth:', error.message);
      dashboardData.quickStats.userGrowth = 0;
    }

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get role-specific statistics
const getRoleStatistics = async (req, res) => {
  try {
    const user = req.user;
    const userRole = user.role || user.primaryRole?.code;

    const statistics = {
      role: userRole,
      stats: {}
    };

    // Super Admin and Admin get all statistics
    if (['SUPER_ADMIN', 'ADMIN'].includes(userRole)) {
      const [
        totalUsers,
        totalContent,
        totalStorage,
        activeRoles
      ] = await Promise.all([
        Operator.count().catch(() => 0),
        Article.count().catch(() => 0),
        FileUpload.sum('file_size').catch(() => 0),
        RoleType.count({ where: { is_enable: true } }).catch(() => 0)
      ]);

      statistics.stats = {
        totalUsers,
        totalContent,
        totalStorage: totalStorage || 0,
        activeRoles
      };
    }
    // Content Manager gets content statistics
    else if (userRole === 'CONTENT_MANAGER') {
      const [
        totalArticles,

        totalCategories
      ] = await Promise.all([
        Article.count().catch(() => 0),

        Category.count().catch(() => 0)
      ]);

      statistics.stats = {
        totalArticles,

        totalCategories
      };
    }
    // Content Writer gets limited statistics
    else if (userRole === 'WRITER') {
      const operatorId = user.operatorId || user.id;

      const myArticles = await Article.count({ where: { created_by: operatorId } }).catch(() => 0);

      statistics.stats = {
        myArticles,
        totalContent: myArticles
      };
    }
    // Viewer gets read-only statistics
    else {
      const totalArticles = await Article.count({ where: { status_id: 1 } }).catch(() => 0);

      statistics.stats = {
      };
    }

    res.json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('Role statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardData,
  getRoleStatistics
};


// Get dashboard stats (new comprehensive endpoint)
const getDashboardStats = async (req, res) => {
  try {
    const db = require('../models').sequelize;
    
    // Get counts for various entities
    const [[articleStats]] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status_id = 1 THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) as draft
      FROM article
      WHERE status_id != 2
    `);
    
    // Get new enquiries (last 7 days)
    const [[enquiryStats]] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_this_week
      FROM contacts
    `);
    
    // Get new registrations (last 7 days)
    const [[registrationStats]] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN created_on >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) as new_this_week
      FROM operator
    `);
    
    // Get pending comments
    const [[commentStats]] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved
      FROM article_comments
    `);
    
    // Get average SEO score
    const [[seoStats]] = await db.query(`
      SELECT 
        AVG(seo_score) as avg_score,
        COUNT(*) as total_analyzed
      FROM article_seo_analysis
    `);
    
    // Get popular articles (top 5 by view count)
    const [popularArticles] = await db.query(`
      SELECT 
        a.id,
        a.title,
        a.view_count,
        c.name as category_name
      FROM article a
      LEFT JOIN category c ON a.category_id = c.id
      WHERE a.status_id = 1
      ORDER BY a.view_count DESC
      LIMIT 5
    `);
    
    // Get recent comments (last 5)
    const [recentComments] = await db.query(`
      SELECT 
        c.id,
        c.author_name,
        c.content,
        c.status,
        c.created_at,
        a.title as article_title
      FROM article_comments c
      LEFT JOIN article a ON c.article_id = a.id
      ORDER BY c.created_at DESC
      LIMIT 5
    `);
    
    res.status(200).json({
      success: true,
      data: {
        articles: {
          total: articleStats.total || 0,
          published: articleStats.published || 0,
          draft: articleStats.draft || 0
        },
        enquiries: {
          total: enquiryStats.total || 0,
          newThisWeek: enquiryStats.new_this_week || 0
        },
        registrations: {
          total: registrationStats.total || 0,
          newThisWeek: registrationStats.new_this_week || 0
        },
        comments: {
          total: commentStats.total || 0,
          pending: commentStats.pending || 0,
          approved: commentStats.approved || 0
        },
        seo: {
          avgScore: Math.round(seoStats.avg_score || 0),
          totalAnalyzed: seoStats.total_analyzed || 0
        },
        popularArticles,
        recentComments
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardData,
  getRoleStatistics,
  getDashboardStats
};
