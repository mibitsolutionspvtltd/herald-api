/**
 * Script to verify and display role mappings for all operators
 * Run with: node scripts/verifyRoleMappings.js
 */

require('dotenv').config();
const { Operator, EntityOperatorRoleMapping, RoleType, BackOfficeUsers } = require('../models');

async function verifyRoleMappings() {
  try {
    console.log('🔍 Verifying role mappings...\n');

    // Get all operators with their role mappings
    const operators = await Operator.findAll({
      include: [
        {
          model: EntityOperatorRoleMapping,
          as: 'roleMappings',
          include: [
            {
              model: RoleType,
              as: 'roleType',
              attributes: ['id', 'name', 'code']
            }
          ]
        }
      ]
    });

    console.log(`Found ${operators.length} operators:\n`);

    for (const op of operators) {
      console.log(`📧 ${op.email} (ID: ${op.id})`);
      console.log(`   Name: ${op.first_name} ${op.last_name}`);
      
      if (op.roleMappings && op.roleMappings.length > 0) {
        for (const mapping of op.roleMappings) {
          const status = mapping.active_status_id === 1 ? '✅ Active' : '❌ Inactive';
          const roleName = mapping.roleType ? mapping.roleType.name : 'No Role Type';
          const roleCode = mapping.roleType ? mapping.roleType.code : 'N/A';
          console.log(`   Role: ${roleName} (${roleCode}) - ${status}`);
          console.log(`   Mapping ID: ${mapping.id}, active_status_id: ${mapping.active_status_id}`);
        }
      } else {
        console.log('   ⚠️ No role mappings found!');
      }
      console.log('');
    }

    // Get all role types
    console.log('\n📋 Available Role Types:');
    const roles = await RoleType.findAll({
      where: { is_enable: true },
      attributes: ['id', 'name', 'code']
    });
    
    roles.forEach(role => {
      console.log(`   ${role.id}: ${role.name} (${role.code})`);
    });

    console.log('\n✅ Verification complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyRoleMappings();
