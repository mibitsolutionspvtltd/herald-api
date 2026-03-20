/**
 * Verify Users Script
 * Checks all seeded users have correct credentials and role mappings
 */

const bcrypt = require('bcryptjs');
require('dotenv').config();

const { sequelize } = require('../config/database');
const { 
  Operator, 
  Admin, 
  BackOfficeUsers, 
  EntityOperatorRoleMapping, 
  RoleType 
} = require('../models');

const testUsers = [
  { email: 'superadmin@studentsherald.com', password: 'SuperAdmin@123', type: 'admin' },
  { email: 'admin@studentsherald.com', password: 'Admin@123', type: 'admin' },
  { email: 'contentmanager@studentsherald.com', password: 'ContentMgr@123', type: 'operator' },
  { email: 'editor@studentsherald.com', password: 'Editor@123', type: 'operator' },
  { email: 'writer@studentsherald.com', password: 'Writer@123', type: 'operator' },
  { email: 'viewer@studentsherald.com', password: 'Viewer@123', type: 'operator' },
];

async function verifyUser(userData) {
  console.log(`\n📧 Checking: ${userData.email}`);
  
  if (userData.type === 'admin') {
    const admin = await Admin.findOne({ where: { email: userData.email } });
    if (!admin) {
      console.log('  ❌ Admin not found');
      return false;
    }
    
    const isValid = await bcrypt.compare(userData.password, admin.password);
    console.log(`  ✅ Admin found (ID: ${admin.id})`);
    console.log(`  🔑 Password valid: ${isValid}`);
    
    if (!isValid) {
      console.log('  🔧 Fixing password...');
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await admin.update({ password: hashedPassword });
      console.log('  ✅ Password fixed');
    }
    
    return true;
  } else {
    const operator = await Operator.findOne({ where: { email: userData.email } });
    if (!operator) {
      console.log('  ❌ Operator not found');
      return false;
    }
    
    console.log(`  ✅ Operator found (ID: ${operator.id})`);
    
    // Check role mapping
    const roleMapping = await EntityOperatorRoleMapping.findOne({
      where: { operator_id: operator.id, active_status_id: 1 },
      include: [
        { model: RoleType, as: 'roleType' },
        { model: BackOfficeUsers, as: 'backOfficeUser' }
      ]
    });
    
    if (!roleMapping) {
      console.log('  ❌ No active role mapping found');
      return false;
    }
    
    console.log(`  ✅ Role: ${roleMapping.roleType?.name} (${roleMapping.roleType?.code})`);
    console.log(`  📋 Permissions: ${roleMapping.roleType?.default_permission?.substring(0, 50)}...`);
    
    if (!roleMapping.backOfficeUser) {
      console.log('  ❌ No BackOfficeUser found - creating...');
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const backOfficeUser = await BackOfficeUsers.create({
        password: hashedPassword,
        two_factor_required: false,
        created_by: operator.id,
        created_at: new Date(),
        updated_at: new Date()
      });
      
      await roleMapping.update({ back_office_user_id: backOfficeUser.id });
      console.log('  ✅ BackOfficeUser created and linked');
    } else {
      const isValid = await bcrypt.compare(userData.password, roleMapping.backOfficeUser.password);
      console.log(`  🔑 Password valid: ${isValid}`);
      
      if (!isValid) {
        console.log('  🔧 Fixing password...');
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await roleMapping.backOfficeUser.update({ password: hashedPassword });
        console.log('  ✅ Password fixed');
      }
    }
    
    return true;
  }
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    console.log('\n🔍 Verifying all users...');
    
    for (const user of testUsers) {
      await verifyUser(user);
    }
    
    console.log('\n\n═══════════════════════════════════════════════════════════════');
    console.log('                    VERIFICATION COMPLETE                        ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\nAll users should now be able to login with these credentials:');
    console.log('');
    console.log('ADMIN USERS (Full Access):');
    console.log('  📧 superadmin@studentsherald.com  |  🔑 SuperAdmin@123');
    console.log('  📧 admin@studentsherald.com       |  🔑 Admin@123');
    console.log('');
    console.log('CONTENT MANAGER (Admin Portal Access):');
    console.log('  📧 contentmanager@studentsherald.com  |  🔑 ContentMgr@123');
    console.log('');
    console.log('EDITOR (Admin Portal Access):');
    console.log('  📧 editor@studentsherald.com  |  🔑 Editor@123');
    console.log('');
    console.log('CONTENT WRITER (Admin Portal Access):');
    console.log('  📧 writer@studentsherald.com  |  🔑 Writer@123');
    console.log('');
    console.log('VIEWER (NO Admin Portal Access):');
    console.log('  📧 viewer@studentsherald.com  |  🔑 Viewer@123');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
