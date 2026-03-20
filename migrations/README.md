# Database Migrations

## Overview

This directory contains SQL migration files for the Student Herald API database.

## Migration Files

### COMPLETE_DATABASE_SCHEMA.sql (RECOMMENDED)
**Latest comprehensive migration with full relationships and proper database design.**

This is the complete, production-ready database schema that includes:

- 60+ tables with proper relationships
- Master/lookup tables with seed data
- Geographic tables (country, state, city)
- User authentication and authorization (RBAC)
- Article management with advanced SEO
- University and course management
- Advertisement system
- Document and file management
- Frontend content management
- System configuration
- Proper indexes for performance
- Database views for common queries
- Triggers for automation
- Stored procedures

### Other Migration Files
- `COMPLETE_PRODUCTION_MIGRATION.sql` - Previous production migration
- `FINAL_CLEAN_MIGRATION.sql` - Clean migration variant
- `MASTER_TABLES_COMPLETE.sql` - Master tables only

## How to Run Migrations

### Option 1: Using MySQL Command Line

```bash
# Connect to your database
mysql -u your_username -p your_database_name

# Run the migration
source migrations/COMPLETE_DATABASE_SCHEMA.sql

# Or in one command
mysql -u your_username -p your_database_name < migrations/COMPLETE_DATABASE_SCHEMA.sql
```

### Option 2: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your database
3. File → Open SQL Script
4. Select `COMPLETE_DATABASE_SCHEMA.sql`
5. Execute the script

### Option 3: Using phpMyAdmin

1. Login to phpMyAdmin
2. Select your database
3. Click "Import" tab
4. Choose file: `COMPLETE_DATABASE_SCHEMA.sql`
5. Click "Go"

### Option 4: Using DBeaver

1. Open DBeaver
2. Connect to your database
3. Right-click database → SQL Editor → Load SQL Script
4. Select `COMPLETE_DATABASE_SCHEMA.sql`
5. Execute (Ctrl+Enter or Execute button)

## Database Structure

### Master Tables (Lookup Tables)
- `active_status` - Entity status (Active, Inactive, etc.)
- `gender` - Gender options
- `preferred_language` - Language preferences
- `access_type` - Content access levels
- `robots_meta_tag_type` - SEO robot tags
- `schema_type` - Schema.org types
- `indexing_status_type` - Search indexing status
- `comment_status_type` - Comment moderation status
- `activity_type` - User activity types
- `document_type` - File type categories
- `article_label` - Article labels (Breaking, Featured, etc.)
- `advertisement_type` - Ad types
- `advertisement_format` - Ad formats/sizes

### Geographic Tables
- `country` - Countries
- `state_province` - States/Provinces
- `city` - Cities
- `pin_codes` - Postal codes

### User & Authentication
- `operator` - Main user table
- `back_office_users` - Authentication credentials
- `role_type` - User roles
- `entity_operator_role_mapping` - User-role assignments
- `permission` - System permissions
- `role_permissions` - Role-permission mappings
- `operator_activity_log` - Activity tracking
- `operator_otp_log` - OTP verification
- `user_verification_token` - Email/phone verification

### Content Management
- `article` - Articles/blog posts
- `category` - Content categories
- `tags` - Content tags
- `article_tag` - Article-tag relationships
- `article_authors` - Article authors
- `article_comment` - Comments
- `article_views` - View tracking
- `article_settings` - Article settings
- `article_seo_analysis` - SEO analysis data
- `article_revision` - Version history

### University & Courses
- `universities` - University information
- `courses` - Course catalog
- `university_courses` - University-course relationships

### Advertisement
- `advertisement` - Advertisement management

### Document Management
- `document` - File storage
- `document_metadata` - File metadata
- `file_upload` - Upload tracking

### Frontend Content
- `hero_content` - Hero sections
- `carousel_items` - Carousel slides
- `navigation_menu` - Navigation menus

### System
- `config_option` - System configuration
- `contacts` - Contact form submissions

## Relationships

### Key Relationships

1. **Article → Category** (Many-to-One)
   - Each article belongs to one category
   - Categories can have multiple articles

2. **Article → Tags** (Many-to-Many)
   - Articles can have multiple tags
   - Tags can be used by multiple articles
   - Junction table: `article_tag`

3. **Article → Operator** (Many-to-Many for authors)
   - Articles can have multiple authors
   - Operators can author multiple articles
   - Junction table: `article_authors`

4. **Article → Document** (One-to-One for cover image)
   - Each article can have one cover image
   - Documents can be reused

5. **Operator → Role** (Many-to-Many)
   - Operators can have multiple roles
   - Roles can be assigned to multiple operators
   - Junction table: `entity_operator_role_mapping`

6. **Role → Permission** (Many-to-Many)
   - Roles can have multiple permissions
   - Permissions can belong to multiple roles
   - Junction table: `role_permissions`

7. **University → Courses** (One-to-Many)
   - Universities can offer multiple courses
   - Each course belongs to one university

8. **Category → Country** (Many-to-One)
   - Categories can be country-specific
   - Countries can have multiple categories

## Indexes

The schema includes optimized indexes for:
- Primary keys (auto-indexed)
- Foreign keys
- Frequently queried columns
- Composite indexes for common query patterns
- Fulltext indexes for search functionality

## Views

Pre-built views for common queries:
- `v_published_articles` - Published articles with author info
- `v_universities_with_courses` - Universities with course counts

## Triggers

Automated triggers for:
- Updating article view counts
- Updating comment counts
- Maintaining audit timestamps

## Stored Procedures

- `sp_get_article_details` - Get complete article information
- `sp_get_user_permissions` - Get user's effective permissions

## Seed Data

The migration includes seed data for:
- Active status values
- Gender options
- Languages
- Access types
- SEO-related master data
- Role types (Admin, Editor, Writer, Viewer)
- Basic permissions
- Advertisement types and formats

## Test Data & Credentials

The migration also includes comprehensive test data:

### Test Users (8 accounts)
All users have the password: **Password123!**

- **superadmin** / superadmin@studentherald.com (Super Admin)
- **admin** / admin@studentherald.com (Admin)
- **manager** / manager@studentherald.com (Content Manager)
- **editor** / editor@studentherald.com (Editor)
- **writer** / writer@studentherald.com (Content Writer)
- **viewer** / viewer@studentherald.com (Viewer)
- **writer2** / writer2@studentherald.com (Content Writer)
- **editor2** / editor2@studentherald.com (Editor)

See `TEST_CREDENTIALS.md` for complete details.

### Sample Content
- 5 Articles (with full content, tags, authors, comments)
- 8 Categories
- 15 Tags
- 5 Universities (Harvard, Stanford, MIT, Oxford, Cambridge)
- 5 Courses
- 5 Comments
- 3 Advertisements
- 3 Hero Content items
- 3 Carousel items
- 10 Navigation menu items
- 3 Contact submissions
- 8 Countries
- 6 Config options

⚠️ **IMPORTANT**: Delete or change test credentials before production deployment!

## Migration Order

If running migrations separately:

1. `COMPLETE_DATABASE_SCHEMA.sql` (All-in-one - RECOMMENDED)

OR

1. Master tables
2. Geographic tables
3. User and authentication tables
4. Content tables
5. Relationship tables
6. Seed data

## Rollback

To rollback the migration:

```sql
-- WARNING: This will delete all data!
DROP DATABASE IF EXISTS your_database_name;
CREATE DATABASE your_database_name;
```

## Verification

After running the migration, verify:

```sql
-- Check table count
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'your_database_name';

-- Check foreign keys
SELECT COUNT(*) FROM information_schema.key_column_usage 
WHERE table_schema = 'your_database_name' 
AND referenced_table_name IS NOT NULL;

-- Check seed data
SELECT COUNT(*) FROM active_status;
SELECT COUNT(*) FROM role_type;
SELECT COUNT(*) FROM permission;
```

## Troubleshooting

### Foreign Key Errors
If you get foreign key errors:
```sql
SET FOREIGN_KEY_CHECKS = 0;
-- Run your migration
SET FOREIGN_KEY_CHECKS = 1;
```

### Character Set Issues
Ensure your database uses utf8mb4:
```sql
ALTER DATABASE your_database_name 
CHARACTER SET = utf8mb4 
COLLATE = utf8mb4_unicode_ci;
```

### Permission Issues
Ensure your MySQL user has sufficient privileges:
```sql
GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

## Support

For issues or questions:
1. Check the error message carefully
2. Verify database connection
3. Ensure MySQL version 5.7+ or 8.0+
4. Check user permissions
5. Review the migration file for syntax errors

## Notes

- All tables use InnoDB engine for transaction support
- All tables use utf8mb4 character set for full Unicode support
- Foreign keys have proper ON DELETE and ON UPDATE actions
- Indexes are optimized for common query patterns
- Seed data provides a working baseline
