const bcrypt = require('bcryptjs');
require('dotenv').config();

const { sequelize } = require('../config/database');
const { Operator, BackOfficeUsers, EntityOperatorRoleMapping, RoleType } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // First, create or update CONTENT_MANAGER role
    let contentManagerRole = await RoleType.findOne({ where: { code: 'CONTENT_MANAGER' } });
    
    if (!contentManagerRole) {
      contentManagerRole = await RoleType.create({
        name: 'Content Manager',
        code: 'CONTENT_MANAGER',
        default_permission: 'CREATE_ARTICLE,VIEW_ARTICLE,EDIT_OWN_ARTICLE,EDIT_ANY_ARTICLE,DELETE_ARTICLE,PUBLISH_ARTICLE,APPROVE_ARTICLE,REJECT_ARTICLE,CREATE_BLOG,EDIT_ANY_BLOG,DELETE_ANY_BLOG,VIEW_BLOG,PUBLISH_BLOG,CREATE_CATEGORY,EDIT_CATEGORY,DELETE_CATEGORY,VIEW_CATEGORY,CREATE_HERO_CONTENT,EDIT_HERO_CONTENT,DELETE_HERO_CONTENT,VIEW_HERO_CONTENT,MANAGE_HERO_CONTENT,CREATE_CAROUSEL,EDIT_CAROUSEL,DELETE_CAROUSEL,VIEW_CAROUSEL,CREATE_COURSE,EDIT_COURSE,DELETE_COURSE,VIEW_COURSE,CREATE_UNIVERSITY,EDIT_UNIVERSITY,DELETE_UNIVERSITY,VIEW_UNIVERSITY,CREATE_DOCUMENT,EDIT_DOCUMENT,DELETE_DOCUMENT,VIEW_DOCUMENT,MANAGE_DOCUMENTS,VIEW_USER,VIEW_CONTACT,MANAGE_CONTACT,VIEW_ANALYTICS,VIEW_REPORTS,VIEW_SETTINGS,EDIT_SETTINGS,ACCESS_ADMIN_PORTAL',
        is_enable: true,
        app_allowed: true,
        two_factor_required: false
      });
      console.log('Created CONTENT_MANAGER role with ID:', contentManagerRole.id);
    } else {
      console.log('Found CONTENT_MANAGER role with ID:', contentManagerRole.id);
    }

    // Check if content manager user exists
    const existingOperator = await Operator.findOne({ where: { email: 'contentmanager@studentsherald.com' } });
    
    if (existingOperator) {
      console.log('Content Manager user already exists');
      process.exit(0);
    }

    // Create content manager user
    const hashedPassword = await bcrypt.hash('ContentMgr@123', 10);

    const operator = await Operator.create({
      email: 'contentmanager@studentsherald.com',
      first_name: 'Content',
      middle_name: '',
      last_name: 'Manager',
      created_on: new Date(),
      last_updated_on: new Date()
    });

    const backOfficeUser = await BackOfficeUsers.create({
      password: hashedPassword,
      two_factor_required: false,
      created_by: operator.id,
      created_at: new Date(),
      updated_at: new Date()
    });

    await EntityOperatorRoleMapping.create({
      operator_id: operator.id,
      role_type_id: contentManagerRole.id,
      back_office_user_id: backOfficeUser.id,
      active_status_id: 1,
      created_on: new Date(),
      last_updated_on: new Date(),
      created_by: operator.id
    });

    console.log('✅ Created Content Manager: contentmanager@studentsherald.com (Password: ContentMgr@123)');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
