# Database Schema Summary

## Overview

Complete production-ready database schema for Student Herald API with proper relationships, indexes, and constraints.

## New Migration File

**File**: `migrations/COMPLETE_DATABASE_SCHEMA.sql`

This is a comprehensive, production-ready migration that replaces all previous migration files.

## What's Included

### 1. Master/Lookup Tables (20+ tables)
- Active Status, Gender, Languages
- Access Types, SEO Types
- Document Types, Activity Types
- Advertisement Types & Formats
- And more...

### 2. Geographic Tables (5 tables)
- Countries with ISO codes
- States/Provinces
- Cities
- Pin Codes
- Full geographic hierarchy

### 3. User & Authentication (15+ tables)
- Operator (main user table)
- Back Office Users (credentials)
- Role-Based Access Control (RBAC)
- Permissions & Role Mappings
- Activity Logs, OTP Logs
- Device Registration
- User Verification

### 4. Content Management (15+ tables)
- Articles with advanced SEO
- Categories (hierarchical)
- Tags (many-to-many)
- Comments (nested)
- Revisions (version history)
- Views tracking
- SEO Analysis
- Article Settings

### 5. University & Courses (3 tables)
- Universities (enhanced)
- Courses
- University-Course relationships

### 6. Advertisement (4 tables)
- Advertisements
- Types & Formats
- Targeting & Analytics

### 7. Document Management (4 tables)
- Documents
- Metadata
- File Uploads
- Type Management

### 8. Frontend Content (3 tables)
- Hero Content
- Carousel Items
- Navigation Menus

### 9. System & Configuration (5+ tables)
- Config Options
- Contacts/Enquiries
- Search Metadata
- Services & Channels

### 10. Additional Features
- Party Management (Advisors, Agents, etc.)
- Content Creators
- Invitations
- Addresses

## Key Features

### Proper Relationships
✅ All foreign keys defined  
✅ ON DELETE and ON UPDATE actions  
✅ Cascading deletes where appropriate  
✅ SET NULL for optional relationships  

### Performance Optimization
✅ Primary key indexes  
✅ Foreign key indexes  
✅ Composite indexes for common queries  
✅ Fulltext indexes for search  

### Data Integrity
✅ NOT NULL constraints  
✅ UNIQUE constraints  
✅ DEFAULT values  
✅ CHECK constraints (via ENUM)  

### Advanced Features
✅ Database views for common queries  
✅ Triggers for automation  
✅ Stored procedures  
✅ JSON columns for flexible data  

### Seed Data
✅ All master tables populated  
✅ Role types (Admin, Editor, Writer, Viewer)  
✅ Permissions  
✅ Status values  
✅ SEO configurations  

## Database Statistics

- **Total Tables**: 60+
- **Master Tables**: 20+
- **Junction Tables**: 8+
- **Views**: 2
- **Triggers**: 4
- **Stored Procedures**: 2
- **Foreign Keys**: 80+
- **Indexes**: 150+

## Relationship Highlights

### Article Relationships
```
article
├── category (many-to-one)
├── tags (many-to-many via article_tag)
├── authors (many-to-many via article_authors)
├── comments (one-to-many)
├── views (one-to-many)
├── revisions (one-to-many)
├── seo_analysis (one-to-one)
├── settings (one-to-one)
├── cover_image (many-to-one to document)
├── created_by (many-to-one to operator)
└── related_articles (many-to-many via related_article)
```

### User Relationships
```
operator
├── roles (many-to-many via entity_operator_role_mapping)
├── permissions (many-to-many via operator_permission)
├── authored_articles (many-to-many via article_authors)
├── created_articles (one-to-many)
├── activity_logs (one-to-many)
├── otp_logs (one-to-many)
├── devices (one-to-many)
└── back_office_user (one-to-one)
```

### University Relationships
```
universities
├── courses (one-to-many)
├── logo (many-to-one to document)
├── cover_image (many-to-one to document)
└── status (many-to-one to active_status)
```

## How to Use

### 1. Run the Migration

```bash
mysql -u username -p database_name < migrations/COMPLETE_DATABASE_SCHEMA.sql
```

### 2. Verify Installation

```sql
-- Check tables
SHOW TABLES;

-- Check foreign keys
SELECT * FROM information_schema.key_column_usage 
WHERE table_schema = 'your_database' 
AND referenced_table_name IS NOT NULL;

-- Check seed data
SELECT * FROM role_type;
SELECT * FROM active_status;
SELECT * FROM permission;
```

### 3. Test Relationships

```sql
-- Test article with category
SELECT a.title, c.name as category 
FROM article a 
LEFT JOIN category c ON a.category_id = c.id;

-- Test user with roles
SELECT o.email, rt.name as role 
FROM operator o
JOIN entity_operator_role_mapping eorm ON o.id = eorm.operator_id
JOIN role_type rt ON eorm.role_type_id = rt.id;
```

## Migration Benefits

### Before (Old Migrations)
❌ Multiple migration files  
❌ Inconsistent relationships  
❌ Missing foreign keys  
❌ No indexes  
❌ No seed data  
❌ Manual relationship management  

### After (New Migration)
✅ Single comprehensive file  
✅ All relationships defined  
✅ All foreign keys with proper actions  
✅ Optimized indexes  
✅ Complete seed data  
✅ Automatic relationship management  
✅ Views, triggers, and procedures  
✅ Production-ready  

## Deployment

### Local Development
```bash
mysql -u root -p student_herald_dev < migrations/COMPLETE_DATABASE_SCHEMA.sql
```

### Production (Render/Railway)
```bash
mysql -h <host> -P <port> -u <user> -p<password> <database> < migrations/COMPLETE_DATABASE_SCHEMA.sql
```

### Using Node.js
```javascript
const mysql = require('mysql2/promise');
const fs = require('fs');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  const sql = fs.readFileSync('migrations/COMPLETE_DATABASE_SCHEMA.sql', 'utf8');
  await connection.query(sql);
  console.log('Migration completed!');
  await connection.end();
}

runMigration();
```

## Compatibility

- **MySQL**: 5.7+, 8.0+ ✅
- **MariaDB**: 10.2+ ✅
- **Character Set**: utf8mb4 ✅
- **Engine**: InnoDB ✅
- **Collation**: utf8mb4_unicode_ci ✅

## Best Practices Implemented

1. **Naming Conventions**
   - Tables: lowercase with underscores
   - Columns: lowercase with underscores
   - Foreign keys: `table_id` format
   - Indexes: `idx_` prefix

2. **Data Types**
   - VARCHAR for variable text
   - TEXT for long content
   - INT for IDs and counts
   - DATETIME for timestamps
   - BOOLEAN for flags
   - JSON for flexible data
   - ENUM for fixed options

3. **Constraints**
   - Primary keys on all tables
   - Foreign keys with proper actions
   - UNIQUE constraints where needed
   - NOT NULL for required fields
   - DEFAULT values for optional fields

4. **Performance**
   - Indexes on foreign keys
   - Composite indexes for common queries
   - Fulltext indexes for search
   - Views for complex queries

5. **Maintainability**
   - Clear table names
   - Descriptive column names
   - Comments on complex fields
   - Organized by sections
   - Seed data included

## Next Steps

1. ✅ Run the migration
2. ✅ Verify all tables created
3. ✅ Check foreign key relationships
4. ✅ Test with your application
5. ✅ Seed additional data if needed
6. ✅ Deploy to production

## Support

For detailed information, see:
- `migrations/README.md` - Migration guide
- `migrations/COMPLETE_DATABASE_SCHEMA.sql` - The migration file
- `models/` directory - Sequelize models

## Summary

This new migration provides a complete, production-ready database schema with:
- Proper relationships and foreign keys
- Optimized indexes for performance
- Seed data for immediate use
- Advanced features (views, triggers, procedures)
- Full Unicode support
- Transaction support
- Data integrity constraints

**Ready to deploy!** 🚀
