const { Sequelize } = require('sequelize');
//require('dotenv').config({ path: './config.env' });
require('dotenv').config();


let sequelize;

if (process.env.DB_DIALECT === 'sqlite') {
  // SQLite configuration for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './database.sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: false,
      underscored: true,
      freezeTableName: true
    }
  });
} else {
  
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: process.env.DB_DIALECT,
      logging: false, 
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: false,
        underscored: true,
        freezeTableName: true
      },
      dialectOptions: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    }
  );
}

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Database connection established successfully.');
  } catch (error) {
    console.error(' Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
