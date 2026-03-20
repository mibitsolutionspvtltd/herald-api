require('dotenv').config();

const { sequelize } = require('../config/database');
const { RoleType } = require('../models');

const ADMIN_FULL_PERMISSIONS = 'ALL,CREATE_USER,VIEW_USER,EDIT_USER,DELETE_USER,CREATE_ADMIN,DELETE_ADMIN,MANAGE_ADMINS,CREATE_ARTICLE,VIEW_ARTICLE,EDIT_OWN_ARTICLE,EDIT_ANY_ARTICLE,DELETE_ARTICLE,PUBLISH_ARTICLE,APPROVE_ARTICLE,REJECT_ARTICLE,CREATE_CATEGORY,EDIT_CATEGORY,DELETE_CATEGORY,VIEW_CATEGORY,MANAGE_HERO_CONTENT,MANAGE_DOCUMENTS,MANAGE_ROLES,MANAGE_PERMISSIONS,VIEW_ANALYTICS,SYSTEM_SETTINGS,CREATE_BLOG,EDIT_ANY_BLOG,DELETE_ANY_BLOG,VIEW_BLOG,PUBLISH_BLOG,CREATE_CAROUSEL,EDIT_CAROUSEL,DELETE_CAROUSEL,VIEW_CAROUSEL,CREATE_COURSE,EDIT_COURSE,DELETE_COURSE,VIEW_COURSE,CREATE_UNIVERSITY,EDIT_UNIVERSITY,DELETE_UNIVERSITY,VIEW_UNIVERSITY,VIEW_CONTACT,MANAGE_CONTACT,VIEW_REPORTS,VIEW_SETTINGS,EDIT_SETTINGS,ACCESS_ADMIN_PORTAL,CREATE_HERO_CONTENT,EDIT_HERO_CONTENT,DELETE_HERO_CONTENT,VIEW_HERO_CONTENT,CREATE_DOCUMENT,EDIT_DOCUMENT,DELETE_DOCUMENT,VIEW_DOCUMENT';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Update all ADMIN and SUPER_ADMIN roles with full permissions
    const adminRoles = await RoleType.findAll({
      where: {
        code: ['ADMIN', 'SUPER_ADMIN']
      }
    });

    console.log(`Found ${adminRoles.length} admin roles to update`);

    for (const role of adminRoles) {
      await role.update({
        default_permission: ADMIN_FULL_PERMISSIONS,
        is_enable: true,
        app_allowed: true
      });
      console.log(`✅ Updated role ID ${role.id}: ${role.name} (${role.code})`);
    }

    console.log('\n✅ All admin roles updated with full permissions including:');
    console.log('  - CREATE_ADMIN: Can create new admin users');
    console.log('  - DELETE_ADMIN: Can delete admin users');
    console.log('  - MANAGE_ADMINS: Full admin management');
    console.log('  - ALL: Full system access');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
