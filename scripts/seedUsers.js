/**
 * Database Seeder Script - Insert All Role Users
 * Run: node scripts/seedUsers.js
 */

const bcrypt = require('bcryptjs');
require('dotenv').config();

const { sequelize } = require('../config/database');
const {
  Admin,
  Operator,
  BackOfficeUsers,
  EntityOperatorRoleMapping,
  RoleType,
  ActiveStatus
} = require('../models');

// Default users for each role
const defaultUsers = [
  // Super Admin (Admin Table)
  {
    type: 'admin',
    firstName: 'Super',
    lastName: 'Admin',
    email: 'superadmin@studentsherald.com',
    password: 'SuperAdmin@123',
    roleCode: 'ADMIN'
  },
  // Admin (Admin Table)
  {
    type: 'admin',
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@studentsherald.com',
    password: 'Admin@123',
    roleCode: 'ADMIN'
  },
  // Content Manager (Operator Table)
  {
    type: 'operator',
    firstName: 'Content',
    lastName: 'Manager',
    email: 'contentmanager@studentsherald.com',
    password: 'ContentMgr@123',
    roleCode: 'CONTENT_MANAGER'
  },
  // Editor (Operator Table)
  {
    type: 'operator',
    firstName: 'Chief',
    lastName: 'Editor',
    email: 'editor@studentsherald.com',
    password: 'Editor@123',
    roleCode: 'EDITOR'
  },
  // Content Writer (Operator Table)
  {
    type: 'operator',
    firstName: 'Content',
    lastName: 'Writer',
    email: 'writer@studentsherald.com',
    password: 'Writer@123',
    roleCode: 'CONTENT_WRITER'
  },
  // Viewer (Operator Table)
  {
    type: 'operator',
    firstName: 'Test',
    lastName: 'Viewer',
    email: 'viewer@studentsherald.com',
    password: 'Viewer@123',
    roleCode: 'VIEWER'
  }
];

// Role definitions with full permissions
const roleDefinitions = [
  {
    id: 1,
    name: 'Admin',
    code: 'ADMIN',
    default_permission: 'ALL,CREATE_USER,VIEW_USER,EDIT_USER,DELETE_USER,CREATE_ARTICLE,VIEW_ARTICLE,EDIT_OWN_ARTICLE,EDIT_ANY_ARTICLE,DELETE_ARTICLE,PUBLISH_ARTICLE,APPROVE_ARTICLE,REJECT_ARTICLE,CREATE_CATEGORY,EDIT_CATEGORY,DELETE_CATEGORY,MANAGE_HERO_CONTENT,MANAGE_DOCUMENTS,MANAGE_ROLES,MANAGE_PERMISSIONS,VIEW_ANALYTICS,SYSTEM_SETTINGS,CREATE_BLOG,EDIT_ANY_BLOG,DELETE_ANY_BLOG,VIEW_BLOG,PUBLISH_BLOG,CREATE_CAROUSEL,EDIT_CAROUSEL,DELETE_CAROUSEL,VIEW_CAROUSEL,CREATE_COURSE,EDIT_COURSE,DELETE_COURSE,VIEW_COURSE,CREATE_UNIVERSITY,EDIT_UNIVERSITY,DELETE_UNIVERSITY,VIEW_UNIVERSITY,VIEW_CONTACT,MANAGE_CONTACT,VIEW_REPORTS,VIEW_SETTINGS,EDIT_SETTINGS,ACCESS_ADMIN_PORTAL,CREATE_ADMIN,DELETE_ADMIN',
    is_enable: true,
    app_allowed: true,
    two_factor_required: false
  },
  {
    id: 2,
    name: 'Content Manager',
    code: 'CONTENT_MANAGER',
    default_permission: 'CREATE_ARTICLE,VIEW_ARTICLE,EDIT_OWN_ARTICLE,EDIT_ANY_ARTICLE,DELETE_ARTICLE,PUBLISH_ARTICLE,APPROVE_ARTICLE,REJECT_ARTICLE,CREATE_BLOG,EDIT_ANY_BLOG,DELETE_ANY_BLOG,VIEW_BLOG,PUBLISH_BLOG,CREATE_CATEGORY,EDIT_CATEGORY,DELETE_CATEGORY,VIEW_CATEGORY,CREATE_HERO_CONTENT,EDIT_HERO_CONTENT,DELETE_HERO_CONTENT,VIEW_HERO_CONTENT,CREATE_CAROUSEL,EDIT_CAROUSEL,DELETE_CAROUSEL,VIEW_CAROUSEL,CREATE_COURSE,EDIT_COURSE,DELETE_COURSE,VIEW_COURSE,CREATE_UNIVERSITY,EDIT_UNIVERSITY,DELETE_UNIVERSITY,VIEW_UNIVERSITY,CREATE_DOCUMENT,EDIT_DOCUMENT,DELETE_DOCUMENT,VIEW_DOCUMENT,VIEW_USER,VIEW_CONTACT,MANAGE_CONTACT,VIEW_ANALYTICS,VIEW_REPORTS,VIEW_SETTINGS,EDIT_SETTINGS,ACCESS_ADMIN_PORTAL',
    is_enable: true,
    app_allowed: true,
    two_factor_required: false
  },
  {
    id: 3,
    name: 'Editor',
    code: 'EDITOR',
    default_permission: 'VIEW_ARTICLE,APPROVE_ARTICLE,REJECT_ARTICLE,VIEW_BLOG,VIEW_CATEGORY,VIEW_HERO_CONTENT,VIEW_CAROUSEL,VIEW_COURSE,VIEW_UNIVERSITY,VIEW_DOCUMENT,VIEW_CONTACT,VIEW_ANALYTICS,VIEW_REPORTS,VIEW_SETTINGS,ACCESS_ADMIN_PORTAL',
    is_enable: true,
    app_allowed: true,
    two_factor_required: false
  },
  {
    id: 4,
    name: 'Content Writer',
    code: 'CONTENT_WRITER',
    default_permission: 'CREATE_ARTICLE,EDIT_OWN_ARTICLE,DELETE_OWN_ARTICLE,VIEW_ARTICLE,CREATE_BLOG,EDIT_OWN_BLOG,DELETE_OWN_BLOG,VIEW_BLOG,VIEW_CATEGORY,VIEW_DOCUMENT,ACCESS_ADMIN_PORTAL',
    is_enable: true,
    app_allowed: true,
    two_factor_required: false
  },
  {
    id: 5,
    name: 'Viewer',
    code: 'VIEWER',
    default_permission: 'VIEW_ARTICLE,VIEW_BLOG,VIEW_CATEGORY,VIEW_COURSE,VIEW_UNIVERSITY',
    is_enable: true,
    app_allowed: false,
    two_factor_required: false
  }
];

async function seedRoles() {
  console.log('🔄 Seeding/Updating Role Types...');
  
  for (const role of roleDefinitions) {
    try {
      // First try to find by code
      let roleType = await RoleType.findOne({ where: { code: role.code } });
      
      if (roleType) {
        // Update existing role with new permissions
        await roleType.update({
          name: role.name,
          default_permission: role.default_permission,
          is_enable: role.is_enable,
          app_allowed: role.app_allowed
        });
        console.log(`  ✅ Updated role: ${role.name} (${role.code})`);
      } else {
        // Try to find by ID
        roleType = await RoleType.findByPk(role.id);
        
        if (roleType) {
          // Update existing role by ID
          await roleType.update({
            name: role.name,
            code: role.code,
            default_permission: role.default_permission,
            is_enable: role.is_enable,
            app_allowed: role.app_allowed
          });
          console.log(`  ✅ Updated role by ID: ${role.name} (${role.code})`);
        } else {
          // Create new role without specifying ID (let DB auto-increment)
          const newRole = await RoleType.create({
            name: role.name,
            code: role.code,
            default_permission: role.default_permission,
            is_enable: role.is_enable,
            app_allowed: role.app_allowed,
            two_factor_required: role.two_factor_required
          });
          console.log(`  ✅ Created role: ${role.name} (${role.code}) with ID: ${newRole.id}`);
        }
      }
    } catch (error) {
      console.error(`  ⚠️ Error with role ${role.name}:`, error.message);
    }
  }
}

async function seedActiveStatus() {
  console.log('🔄 Seeding Active Status...');
  
  const statuses = [
    { id: 1, name: 'Active', code: 'ACTIVE' },
    { id: 2, name: 'Inactive', code: 'INACTIVE' },
    { id: 3, name: 'Suspended', code: 'SUSPENDED' }
  ];
  
  for (const status of statuses) {
    await ActiveStatus.findOrCreate({
      where: { id: status.id },
      defaults: status
    });
  }
  console.log('  ✅ Active statuses ready');
}

async function seedUsers() {
  console.log('🔄 Seeding Users...');
  
  for (const userData of defaultUsers) {
    try {
      // Check if user already exists
      const existingAdmin = await Admin.findOne({ where: { email: userData.email } });
      const existingOperator = await Operator.findOne({ where: { email: userData.email } });
      
      if (existingAdmin || existingOperator) {
        console.log(`  ⏭️  User already exists: ${userData.email}`);
        continue;
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      if (userData.type === 'admin') {
        // Create in Admin table
        const admin = await Admin.create({
          firstName: userData.firstName,
          middleName: '',
          lastName: userData.lastName,
          email: userData.email,
          password: hashedPassword,
          two_factor_required: false,
          created_on: new Date(),
          last_updated_on: new Date()
        });
        
        console.log(`  ✅ Created Admin: ${userData.email} (Password: ${userData.password})`);
      } else {
        // Create in Operator table
        const operator = await Operator.create({
          email: userData.email,
          first_name: userData.firstName,
          middle_name: '',
          last_name: userData.lastName,
          created_on: new Date(),
          last_updated_on: new Date()
        });
        
        // Create BackOfficeUser
        const backOfficeUser = await BackOfficeUsers.create({
          password: hashedPassword,
          two_factor_required: false,
          created_by: operator.id,
          created_at: new Date(),
          updated_at: new Date()
        });
        
        // Get role type
        const roleType = await RoleType.findOne({ where: { code: userData.roleCode } });
        
        // Create role mapping
        await EntityOperatorRoleMapping.create({
          operator_id: operator.id,
          role_type_id: roleType.id,
          back_office_user_id: backOfficeUser.id,
          active_status_id: 1,
          created_on: new Date(),
          last_updated_on: new Date(),
          created_by: operator.id
        });
        
        console.log(`  ✅ Created Operator: ${userData.email} (Role: ${userData.roleCode}, Password: ${userData.password})`);
      }
    } catch (error) {
      console.error(`  ❌ Error creating user ${userData.email}:`, error.message);
    }
  }
}

async function main() {
  try {
    console.log('🚀 Starting Database Seeder...\n');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected\n');
    
    // Seed data
    await seedActiveStatus();
    await seedRoles();
    await seedUsers();
    
    console.log('\n✅ Seeding completed successfully!\n');
    
    // Print credentials summary
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                    LOGIN CREDENTIALS SUMMARY                   ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('ADMIN USERS (Full Access):');
    console.log('  📧 superadmin@studentsherald.com  |  🔑 SuperAdmin@123');
    console.log('  📧 admin@studentsherald.com       |  🔑 Admin@123');
    console.log('');
    console.log('CONTENT MANAGER:');
    console.log('  📧 contentmanager@studentsherald.com  |  🔑 ContentMgr@123');
    console.log('');
    console.log('EDITOR:');
    console.log('  📧 editor@studentsherald.com  |  🔑 Editor@123');
    console.log('');
    console.log('CONTENT WRITER:');
    console.log('  📧 writer@studentsherald.com  |  🔑 Writer@123');
    console.log('');
    console.log('VIEWER:');
    console.log('  📧 viewer@studentsherald.com  |  🔑 Viewer@123');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
