const { sequelize } = require('../config/database');
const { RoleType } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Current Roles in Database:');
    const roles = await RoleType.findAll();
    roles.forEach(r => {
      console.log(`  ID: ${r.id}, Code: ${r.code}, Name: ${r.name}`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
  
})();
