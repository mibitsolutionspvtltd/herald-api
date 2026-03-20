/**
 * Simple script to check and fix courses foreign key
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false
    }
);

async function fixFK() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database');

        // Check current constraint
        const [constraints] = await sequelize.query(`
      SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'courses' 
        AND COLUMN_NAME = 'created_by' 
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);

        console.log('Current constraints:', JSON.stringify(constraints));

        if (constraints.length > 0 && constraints[0].REFERENCED_TABLE_NAME === 'admin_users') {
            console.log('Found old constraint pointing to admin_users. Fixing...');

            // Drop the old constraint
            await sequelize.query(`ALTER TABLE courses DROP FOREIGN KEY courses_ibfk_3`);
            console.log('Dropped old constraint');

            // Make column nullable
            await sequelize.query(`ALTER TABLE courses MODIFY COLUMN created_by INT(11) NULL`);
            console.log('Made column nullable');

            // Add new constraint to operator table
            try {
                await sequelize.query(`
          ALTER TABLE courses 
          ADD CONSTRAINT courses_operator_fk 
          FOREIGN KEY (created_by) 
          REFERENCES operator(id) 
          ON DELETE SET NULL 
          ON UPDATE CASCADE
        `);
                console.log('Added new constraint to operator table');
            } catch (e) {
                console.log('Could not add new constraint:', e.message);
            }
        } else if (constraints.length === 0) {
            console.log('No foreign key constraint exists - OK');
        } else {
            console.log('Constraint already points to correct table');
        }

        // Final check
        const [final] = await sequelize.query(`
      SELECT CONSTRAINT_NAME, REFERENCED_TABLE_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'courses' 
        AND COLUMN_NAME = 'created_by' 
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
        console.log('Final state:', JSON.stringify(final));
        console.log('DONE!');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await sequelize.close();
    }
}

fixFK();
