-- ============================================================================
-- COMPLETE PRODUCTION MIGRATION SCRIPT
-- ============================================================================
-- Purpose: Add missing comment_count column and all advanced features
-- Database: student_dev (or your production database)
-- Version: 1.0
-- Date: 2024-02-23
-- 
-- IMPORTANT: 
-- 1. BACKUP YOUR DATABASE BEFORE RUNNING THIS SCRIPT
-- 2. Test on staging environment first
-- 3. Run during maintenance window
-- 
-- Usage:
--   mysql -h HOST -u USER -p DATABASE < COMPLETE_PRODUCTION_MIGRATION.sql
--   Or paste into phpMyAdmin SQL tab
-- ============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET FOREIGN_KEY_CHECKS = 0;
SET @OLD_AUTOCOMMIT = @@AUTOCOMMIT, AUTOCOMMIT = 0;
START TRANSACTION;

-- Use your database (change if needed)
-- USE student_dev;

-- ============================================================================
-- SECTION 1: BACKUP EXISTING ARTICLE TABLE
-- ============================================================================

-- Create backup table with timestamp
SET @backup_table = CONCAT('article_backup_', UNIX_TIMESTAMP());
SET @sql = CONCAT('CREATE TABLE IF NOT EXISTS ', @backup_table, ' AS SELECT * FROM article');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT CONCAT('✓ Backup created: ', @backup_table) AS 'Status';

-- ============================================================================
-- SECTION 2: ADD CRITICAL MISSING COLUMNS TO ARTICLE TABLE
-- ============================================================================

-- Add comment_count (THE CRITICAL FIX)
ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `comment_count` INT(11) DEFAULT 0 COMMENT 'Total comment count';

-- Add excerpt
ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `excerpt` TEXT DEFAULT NULL COMMENT 'Short excerpt for previews';

-- Add created_by
ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `created_by` INT(11) DEFAULT NULL COMMENT 'User who created the article';

-- Add last_updated_by
ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `last_updated_by` INT(11) DEFAULT NULL COMMENT 'User who last updated';

SELECT '✓ Critical columns added' AS 'Status';

-- ============================================================================
-- SECTION 3: ADD SEO ENHANCEMENT COLUMNS
-- ============================================================================

-- Access type
ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `access_type_id` INT(11) DEFAULT 1 COMMENT 'FK to access_type (free/registered/subscribed)';

-- Canonical URL
ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `canonical_url` VARCHAR(500) DEFAULT NULL COMMENT 'Canonical URL for SEO';

-- Open Graph metadata
ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `og_title` VARCHAR(255) DEFAULT NULL COMMENT 'Open Graph title';

ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `og_description` TEXT DEFAULT NULL COMMENT 'Open Graph description';

ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `og_image` VARCHAR(500) DEFAULT NULL COMMENT 'Open Graph image URL';

-- Twitter Card metadata
ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `twitter_title` VARCHAR(255) DEFAULT NULL COMMENT 'Twitter card title';

ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `twitter_description` TEXT DEFAULT NULL COMMENT 'Twitter card description';

ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `twitter_image` VARCHAR(500) DEFAULT NULL COMMENT 'Twitter card image URL';

-- Structured data
ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `structured_data_markup` TEXT DEFAULT NULL COMMENT 'JSON-LD structured data';

-- SEO references
ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `robots_meta_tag_id` INT(11) DEFAULT 1 COMMENT 'FK to robots_meta_tag_type';

ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `schema_type_id` INT(11) DEFAULT 1 COMMENT 'FK to schema_type';

ALTER TABLE `article` 
ADD COLUMN IF NOT EXISTS `indexing_status_id` INT(11) DEFAULT 1 COMMENT 'FK to indexing_status_type';

SELECT '✓ SEO columns added' AS 'Status';

-- ============================================================================
-- SECTION 4: CREATE MASTER/LOOKUP TABLES
-- ============================================================================

-- Access Type Table
CREATE TABLE IF NOT EXISTS `access_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `access_type` (`id`, `name`, `description`) VALUES
(1, 'free', 'Free access for all users'),
(2, 'registered', 'Requires user registration'),
(3, 'subscribed', 'Requires active subscription');

-- Robots Meta Tag Type
CREATE TABLE IF NOT EXISTS `robots_meta_tag_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `value` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `robots_meta_tag_type` (`id`, `name`, `value`, `description`) VALUES
(1, 'index_follow', 'index, follow', 'Allow indexing and following links'),
(2, 'noindex_nofollow', 'noindex, nofollow', 'Prevent indexing and following links'),
(3, 'index_nofollow', 'index, nofollow', 'Allow indexing but prevent following links'),
(4, 'noindex_follow', 'noindex, follow', 'Prevent indexing but allow following links');

-- Schema Type
CREATE TABLE IF NOT EXISTS `schema_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `schema_type` (`id`, `name`, `description`) VALUES
(1, 'Article', 'Standard article schema'),
(2, 'NewsArticle', 'News article schema'),
(3, 'BlogPosting', 'Blog post schema'),
(4, 'ScholarlyArticle', 'Scholarly/academic article schema');

-- Indexing Status Type
CREATE TABLE IF NOT EXISTS `indexing_status_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `indexing_status_type` (`id`, `name`, `description`) VALUES
(1, 'pending', 'Waiting to be indexed'),
(2, 'indexed', 'Successfully indexed by search engines'),
(3, 'excluded', 'Excluded from indexing'),
(4, 'error', 'Error during indexing');

-- Comment Status Type
CREATE TABLE IF NOT EXISTS `comment_status_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `comment_status_type` (`id`, `name`, `description`) VALUES
(1, 'pending', 'Awaiting moderation'),
(2, 'approved', 'Approved and visible'),
(3, 'rejected', 'Rejected by moderator'),
(4, 'spam', 'Marked as spam');

-- Enquiry Status Type
CREATE TABLE IF NOT EXISTS `enquiry_status_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `enquiry_status_type` (`id`, `name`, `description`) VALUES
(1, 'pending', 'New enquiry, not yet contacted'),
(2, 'contacted', 'Initial contact made'),
(3, 'converted', 'Successfully converted to enrollment'),
(4, 'closed', 'Enquiry closed without conversion');

SELECT '✓ Lookup tables created' AS 'Status';

-- ============================================================================
-- SECTION 5: CREATE JUNCTION TABLES
-- ============================================================================

-- Article Authors (Many-to-Many)
CREATE TABLE IF NOT EXISTS `article_authors` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `article_id` INT(11) NOT NULL COMMENT 'Reference to article',
  `author_id` INT(11) NOT NULL COMMENT 'Reference to operator (author)',
  `author_order` INT(11) DEFAULT 1 COMMENT 'Order of authors (for multiple authors)',
  `created_on` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_article_author` (`article_id`, `author_id`),
  KEY `idx_article_authors_article` (`article_id`),
  KEY `idx_article_authors_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Junction table for article authors';

-- Related Articles (Many-to-Many)
CREATE TABLE IF NOT EXISTS `related_article` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `article_id` INT(11) NOT NULL COMMENT 'Main article',
  `related_article_id` INT(11) NOT NULL COMMENT 'Related article',
  `display_order` INT(11) DEFAULT 0 COMMENT 'Display order of related posts',
  `created_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_article_related` (`article_id`, `related_article_id`),
  KEY `idx_related_article_article` (`article_id`),
  KEY `idx_related_article_related` (`related_article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Related articles junction table';

SELECT '✓ Junction tables created' AS 'Status';

-- ============================================================================
-- SECTION 6: CREATE SUPPORT TABLES
-- ============================================================================

-- Article Comments
CREATE TABLE IF NOT EXISTS `article_comments` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `article_id` INT(11) NOT NULL,
  `user_id` INT(11) DEFAULT NULL,
  `parent_comment_id` INT(11) DEFAULT NULL COMMENT 'For nested/threaded comments',
  `author_name` VARCHAR(255) NOT NULL,
  `author_email` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `status_id` INT(11) NOT NULL DEFAULT 1 COMMENT 'FK to comment_status_type',
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_comments_article` (`article_id`),
  KEY `idx_comments_user` (`user_id`),
  KEY `idx_comments_parent` (`parent_comment_id`),
  KEY `idx_comments_status` (`status_id`),
  KEY `idx_comments_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Article comments with moderation';

-- Article Content Images
CREATE TABLE IF NOT EXISTS `article_content_images` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `article_id` INT(11) NOT NULL COMMENT 'Reference to article',
  `document_id` INT(11) NOT NULL COMMENT 'Reference to document (image)',
  `alt_text` VARCHAR(255) DEFAULT NULL COMMENT 'Alt text for accessibility',
  `caption` TEXT DEFAULT NULL COMMENT 'Image caption',
  `image_order` INT(11) DEFAULT 1 COMMENT 'Order in article',
  `created_on` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_content_images_article` (`article_id`),
  KEY `idx_content_images_document` (`document_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Images used within article content';

-- Article Revisions
CREATE TABLE IF NOT EXISTS `article_revisions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `article_id` INT(11) NOT NULL COMMENT 'Reference to article',
  `title` VARCHAR(500) DEFAULT NULL,
  `brief` TEXT DEFAULT NULL,
  `content` TEXT DEFAULT NULL,
  `revision_number` INT(11) NOT NULL COMMENT 'Version number',
  `created_by` INT(11) DEFAULT NULL COMMENT 'User who created this revision',
  `created_on` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  `revision_note` TEXT DEFAULT NULL COMMENT 'Note about what changed',
  PRIMARY KEY (`id`),
  KEY `idx_revisions_article` (`article_id`),
  KEY `idx_revisions_created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Article revision history';

-- Article SEO Analysis
CREATE TABLE IF NOT EXISTS `article_seo_analysis` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `article_id` INT(11) NOT NULL COMMENT 'Reference to article',
  `seo_score` INT(11) DEFAULT 0 COMMENT 'Overall SEO score (0-100)',
  `readability_score` INT(11) DEFAULT 0 COMMENT 'Content readability score',
  `keyword_density` FLOAT DEFAULT 0 COMMENT 'Focus keyword density',
  `has_meta_description` TINYINT(1) DEFAULT 0,
  `has_focus_keyword` TINYINT(1) DEFAULT 0,
  `has_alt_texts` TINYINT(1) DEFAULT 0,
  `word_count` INT(11) DEFAULT 0,
  `recommendations` TEXT DEFAULT NULL COMMENT 'JSON array of SEO recommendations',
  `analyzed_on` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_article_seo_analysis` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='SEO analysis and scoring for articles';

SELECT '✓ Support tables created' AS 'Status';

-- ============================================================================
-- SECTION 7: ADD INDEXES FOR PERFORMANCE
-- ============================================================================

-- Article table indexes (ignore errors if already exist)
ALTER TABLE `article` ADD INDEX IF NOT EXISTS `idx_article_created_by` (`created_by`);
ALTER TABLE `article` ADD INDEX IF NOT EXISTS `idx_article_last_updated_by` (`last_updated_by`);
ALTER TABLE `article` ADD INDEX IF NOT EXISTS `idx_article_access_type` (`access_type_id`);
ALTER TABLE `article` ADD INDEX IF NOT EXISTS `idx_article_robots_meta_tag` (`robots_meta_tag_id`);
ALTER TABLE `article` ADD INDEX IF NOT EXISTS `idx_article_schema_type` (`schema_type_id`);
ALTER TABLE `article` ADD INDEX IF NOT EXISTS `idx_article_indexing_status` (`indexing_status_id`);

SELECT '✓ Indexes added' AS 'Status';

-- ============================================================================
-- SECTION 8: ADD FOREIGN KEY CONSTRAINTS (OPTIONAL - COMMENT OUT IF ISSUES)
-- ============================================================================

-- Note: Foreign keys are optional. Comment out this section if you encounter errors.
-- They provide referential integrity but may cause issues if referenced tables don't exist.

-- Article foreign keys
-- ALTER TABLE `article` ADD CONSTRAINT `fk_article_created_by` 
--   FOREIGN KEY (`created_by`) REFERENCES `operator` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE `article` ADD CONSTRAINT `fk_article_last_updated_by` 
--   FOREIGN KEY (`last_updated_by`) REFERENCES `operator` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE `article` ADD CONSTRAINT `fk_article_access_type` 
--   FOREIGN KEY (`access_type_id`) REFERENCES `access_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE `article` ADD CONSTRAINT `fk_article_robots_meta_tag` 
--   FOREIGN KEY (`robots_meta_tag_id`) REFERENCES `robots_meta_tag_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE `article` ADD CONSTRAINT `fk_article_schema_type` 
--   FOREIGN KEY (`schema_type_id`) REFERENCES `schema_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- ALTER TABLE `article` ADD CONSTRAINT `fk_article_indexing_status` 
--   FOREIGN KEY (`indexing_status_id`) REFERENCES `indexing_status_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

SELECT '✓ Foreign keys skipped (optional)' AS 'Status';

-- ============================================================================
-- SECTION 9: VERIFICATION
-- ============================================================================

-- Check if comment_count exists
SELECT 
  CASE 
    WHEN COUNT(*) > 0 THEN '✓ comment_count column exists'
    ELSE '✗ comment_count column MISSING'
  END AS 'Verification'
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'article' 
  AND COLUMN_NAME = 'comment_count';

-- Count articles (should match pre-migration count)
SELECT CONCAT('✓ Total articles: ', COUNT(*)) AS 'Data Integrity Check'
FROM article;

-- List new tables created
SELECT CONCAT('✓ New tables: ', COUNT(*)) AS 'Tables Created'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN (
    'access_type', 
    'robots_meta_tag_type', 
    'schema_type', 
    'indexing_status_type',
    'comment_status_type',
    'enquiry_status_type',
    'article_authors',
    'related_article',
    'article_comments',
    'article_content_images',
    'article_revisions',
    'article_seo_analysis'
  );

-- ============================================================================
-- SECTION 10: COMMIT TRANSACTION
-- ============================================================================

COMMIT;
SET AUTOCOMMIT = @OLD_AUTOCOMMIT;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

SELECT '========================================' AS '';
SELECT '✓ MIGRATION COMPLETED SUCCESSFULLY' AS 'Status';
SELECT '========================================' AS '';
SELECT '' AS '';
SELECT 'Next Steps:' AS '';
SELECT '1. Verify article count matches pre-migration' AS '';
SELECT '2. Test articles endpoint: GET /api/articles/admin/all' AS '';
SELECT '3. Check admin panel loads articles correctly' AS '';
SELECT '4. Monitor application logs for errors' AS '';
SELECT '' AS '';
SELECT CONCAT('Backup table: ', @backup_table) AS 'Rollback Info';
SELECT 'To rollback: DROP TABLE article; RENAME TABLE [backup] TO article;' AS '';

-- ============================================================================
-- END OF MIGRATION SCRIPT
-- ============================================================================
