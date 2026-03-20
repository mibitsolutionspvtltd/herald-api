/**
 * Test Dashboard Data Script
 * Tests the dashboard data fetching
 */

require('dotenv').config();
const { sequelize } = require('../config/database');
const { 
  Article, 
  // BlogPost, // DEPRECATED - Blog functionality removed
  Category, 
  Courses, 
  Universities, 
  Contacts,
  Operator,
  Admin
} = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected\n');
    console.log('Testing Dashboard Data...\n');

    // Test each count
    console.log('📊 Content Statistics:');
    
    const articleCount = await Article.count().catch(err => {
      console.error('  Article count error:', err.message);
      return 0;
    });
    console.log(`  Articles: ${articleCount}`);

    // Blog count - deprecated
    const blogCount = 0;
    console.log(`  Blogs: ${blogCount} (deprecated)`);

    const categoryCount = await Category.count().catch(err => {
      console.error('  Category count error:', err.message);
      return 0;
    });
    console.log(`  Categories: ${categoryCount}`);

    console.log('\n📚 Educational Statistics:');
    
    const courseCount = await Courses.count().catch(err => {
      console.error('  Course count error:', err.message);
      return 0;
    });
    console.log(`  Courses: ${courseCount}`);

    const universityCount = await Universities.count().catch(err => {
      console.error('  University count error:', err.message);
      return 0;
    });
    console.log(`  Universities: ${universityCount}`);

    console.log('\n👥 User Statistics:');
    
    const operatorCount = await Operator.count().catch(err => {
      console.error('  Operator count error:', err.message);
      return 0;
    });
    console.log(`  Operators: ${operatorCount}`);

    const adminCount = await Admin.count().catch(err => {
      console.error('  Admin count error:', err.message);
      return 0;
    });
    console.log(`  Admins: ${adminCount}`);

    console.log('\n📬 Contact Statistics:');
    
    const contactCount = await Contacts.count().catch(err => {
      console.error('  Contact count error:', err.message);
      return 0;
    });
    console.log(`  Contacts: ${contactCount}`);

    console.log('\n✅ Dashboard data test complete!');
    console.log('\nSummary:');
    console.log(`  Total Content: ${articleCount + blogCount}`);
    console.log(`  Total Users: ${operatorCount + adminCount}`);
    console.log(`  Total Educational: ${courseCount + universityCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
