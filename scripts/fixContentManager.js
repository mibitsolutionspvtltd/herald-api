const bcrypt = require('bcryptjs');
require('dotenv').config();

const { sequelize } = require('../config/database');
const { Operator, BackOfficeUsers, EntityOperatorRoleMapping, RoleType } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Find CONTENT_MANAGER role
    const contentManagerRole = await RoleType.findOne({ where: { code: 'CONTENT_MANAGER' } });
    console.log('CONTENT_MANAGER role ID:', contentManagerRole?.id);

    // Find content manager operator
    const operator = await Operator.findOne({ where: { email: 'contentmanager@studentsherald.com' } });
    
    if (!operator) {
      console.log('Content Manager operator not found, creating...');
      
      const hashedPassword = await bcrypt.hash('ContentMgr@123', 10);

      const newOperator = await Operator.create({
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
        created_by: newOperator.id,
        created_at: new Date(),
        updated_at: new Date()
      });

      await EntityOperatorRoleMapping.create({
        operator_id: newOperator.id,
        role_type_id: contentManagerRole.id,
        back_office_user_id: backOfficeUser.id,
        active_status_id: 1,
        created_on: new Date(),
        last_updated_on: new Date(),
        created_by: newOperator.id
      });

      console.log('✅ Created Content Manager user');
    } else {
      console.log('Found operator ID:', operator.id);
      
      // Check if role mapping exists
      const roleMapping = await EntityOperatorRoleMapping.findOne({
        where: { operator_id: operator.id }
      });
      
      if (roleMapping) {
        console.log('Current role_type_id:', roleMapping.role_type_id);
        
        // Update to CONTENT_MANAGER role
        await roleMapping.update({ role_type_id: contentManagerRole.id });
        console.log('✅ Updated role mapping to CONTENT_MANAGER');
      } else {
        // Create role mapping
        const backOfficeUser = await BackOfficeUsers.findOne({
          where: { created_by: operator.id }
        });
        
        if (!backOfficeUser) {
          const hashedPassword = await bcrypt.hash('ContentMgr@123', 10);
          const newBackOfficeUser = await BackOfficeUsers.create({
            password: hashedPassword,
            two_factor_required: false,
            created_by: operator.id,
            created_at: new Date(),
            updated_at: new Date()
          });
          
          await EntityOperatorRoleMapping.create({
            operator_id: operator.id,
            role_type_id: contentManagerRole.id,
            back_office_user_id: newBackOfficeUser.id,
            active_status_id: 1,
            created_on: new Date(),
            last_updated_on: new Date(),
            created_by: operator.id
          });
        } else {
          await EntityOperatorRoleMapping.create({
            operator_id: operator.id,
            role_type_id: contentManagerRole.id,
            back_office_user_id: backOfficeUser.id,
            active_status_id: 1,
            created_on: new Date(),
            last_updated_on: new Date(),
            created_by: operator.id
          });
        }
        console.log('✅ Created role mapping for Content Manager');
      }
    }

    console.log('\n✅ Content Manager setup complete!');
    console.log('📧 Email: contentmanager@studentsherald.com');
    console.log('🔑 Password: ContentMgr@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
