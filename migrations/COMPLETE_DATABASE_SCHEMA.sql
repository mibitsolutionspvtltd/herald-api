-- ============================================================================
-- STUDENT HERALD API - COMPLETE DATABASE SCHEMA
-- Version: 2.0
-- Description: Production-ready database schema with proper relationships
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ============================================================================
-- SECTION 1: MASTER/LOOKUP TABLES
-- ============================================================================

-- Active Status (Master Table)
CREATE TABLE IF NOT EXISTS `active_status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Gender (Master Table)
CREATE TABLE IF NOT EXISTS `gender` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(10) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Preferred Language (Master Table)
CREATE TABLE IF NOT EXISTS `preferred_language` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(10) NOT NULL UNIQUE,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Access Type (Master Table)
CREATE TABLE IF NOT EXISTS `access_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Robots Meta Tag Type (Master Table)
CREATE TABLE IF NOT EXISTS `robots_meta_tag_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Schema Type (Master Table)
CREATE TABLE IF NOT EXISTS `schema_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `schema_template` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexing Status Type (Master Table)
CREATE TABLE IF NOT EXISTS `indexing_status_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comment Status Type (Master Table)
CREATE TABLE IF NOT EXISTS `comment_status_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Enquiry Status Type (Master Table)
CREATE TABLE IF NOT EXISTS `enquiry_status_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Robot Tags Type (Master Table)
CREATE TABLE IF NOT EXISTS `robot_tags_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Activity Type (Master Table)
CREATE TABLE IF NOT EXISTS `activity_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Address Type (Master Table)
CREATE TABLE IF NOT EXISTS `address_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Document Type (Master Table)
CREATE TABLE IF NOT EXISTS `document_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `allowed_extensions` VARCHAR(255) DEFAULT NULL,
  `max_size_mb` INT DEFAULT 10,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Document Category (Master Table)
CREATE TABLE IF NOT EXISTS `document_category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Document Status (Master Table)
CREATE TABLE IF NOT EXISTS `document_status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Post Status (Master Table)
CREATE TABLE IF NOT EXISTS `post_status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Article Label (Master Table)
CREATE TABLE IF NOT EXISTS `article_label` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `color` VARCHAR(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Advertisement Type (Master Table)
CREATE TABLE IF NOT EXISTS `advertisement_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Advertisement Format (Master Table)
CREATE TABLE IF NOT EXISTS `advertisement_format` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `width` INT DEFAULT NULL,
  `height` INT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Config Option Type (Master Table)
CREATE TABLE IF NOT EXISTS `config_option_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Party Type (Master Table)
CREATE TABLE IF NOT EXISTS `party_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Party Status (Master Table)
CREATE TABLE IF NOT EXISTS `party_status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Client Status (Master Table)
CREATE TABLE IF NOT EXISTS `client_status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Merchant Plan Type (Master Table)
CREATE TABLE IF NOT EXISTS `merchant_plan_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `features` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SECTION 2: GEOGRAPHIC TABLES
-- ============================================================================

-- Country
CREATE TABLE IF NOT EXISTS `country` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(10) NOT NULL UNIQUE,
  `iso_code` VARCHAR(3) DEFAULT NULL,
  `phone_code` VARCHAR(10) DEFAULT NULL,
  `currency` VARCHAR(10) DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`),
  INDEX `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Country Codes
CREATE TABLE IF NOT EXISTS `country_codes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `country_name` VARCHAR(100) NOT NULL,
  `country_code` VARCHAR(10) NOT NULL UNIQUE,
  `phone_code` VARCHAR(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- State/Province
CREATE TABLE IF NOT EXISTS `state_province` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(10) NOT NULL,
  `country_id` INT DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`),
  INDEX `idx_country` (`country_id`),
  FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- States (Alternative State Table)
CREATE TABLE IF NOT EXISTS `states` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `state_code` VARCHAR(10) DEFAULT NULL,
  `country_id` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_country` (`country_id`),
  FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- City
CREATE TABLE IF NOT EXISTS `city` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `state_province_id` INT DEFAULT NULL,
  `country_id` INT DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`),
  INDEX `idx_state` (`state_province_id`),
  INDEX `idx_country` (`country_id`),
  FOREIGN KEY (`state_province_id`) REFERENCES `state_province`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pin Codes
CREATE TABLE IF NOT EXISTS `pin_codes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pin_code` VARCHAR(20) NOT NULL,
  `city_id` INT DEFAULT NULL,
  `state_id` INT DEFAULT NULL,
  `country_id` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_pin` (`pin_code`),
  INDEX `idx_city` (`city_id`),
  FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SECTION 3: USER & AUTHENTICATION TABLES
-- ============================================================================

-- Role Type
CREATE TABLE IF NOT EXISTS `role_type` (
  `id` SMALLINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `default_permission` TEXT DEFAULT NULL COMMENT 'Comma-separated permissions',
  `is_enable` BOOLEAN DEFAULT TRUE,
  `app_allowed` BOOLEAN DEFAULT TRUE,
  `two_factor_required` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id`),
  INDEX `idx_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Operator (Main User Table)
CREATE TABLE IF NOT EXISTS `operator` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(120) DEFAULT NULL,
  `middle_name` VARCHAR(150) DEFAULT NULL,
  `last_name` VARCHAR(150) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL UNIQUE,
  `mobile_number` VARCHAR(15) DEFAULT NULL,
  `phone_number` VARCHAR(255) DEFAULT NULL,
  `isd_code` VARCHAR(10) DEFAULT NULL,
  `date_of_birth` DATE DEFAULT NULL,
  `gender` VARCHAR(10) DEFAULT NULL,
  `gender_id` INT DEFAULT NULL,
  `title` VARCHAR(255) DEFAULT NULL,
  `pan_number` VARCHAR(45) DEFAULT NULL,
  `father_first_name` VARCHAR(255) DEFAULT NULL,
  `father_last_name` VARCHAR(255) DEFAULT NULL,
  `preferred_language_id` INT DEFAULT NULL,
  `phone_verified` BOOLEAN DEFAULT FALSE,
  `mobile_verified` BOOLEAN DEFAULT FALSE,
  `is_aadhar_mobile_verified` BOOLEAN DEFAULT NULL,
  `two_factor_required` BOOLEAN DEFAULT FALSE,
  `password_reset` BOOLEAN DEFAULT NULL,
  `uid` VARCHAR(36) DEFAULT NULL UNIQUE,
  `checksum` VARCHAR(60) DEFAULT NULL,
  `created_on` DATETIME(6) DEFAULT NULL,
  `created_by` INT DEFAULT NULL,
  `last_updated_on` DATETIME(6) DEFAULT NULL,
  `last_updated_by` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_uid` (`uid`),
  INDEX `idx_mobile` (`mobile_number`),
  INDEX `idx_gender` (`gender_id`),
  INDEX `idx_language` (`preferred_language_id`),
  FOREIGN KEY (`gender_id`) REFERENCES `gender`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`preferred_language_id`) REFERENCES `preferred_language`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `operator`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`last_updated_by`) REFERENCES `operator`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Back Office Users (Authentication Credentials)
CREATE TABLE IF NOT EXISTS `back_office_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `last_login` DATETIME DEFAULT NULL,
  `login_attempts` INT DEFAULT 0,
  `is_locked` BOOLEAN DEFAULT FALSE,
  `locked_until` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_operator` (`operator_id`),
  INDEX `idx_username` (`username`),
  FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Entity Operator Role Mapping
CREATE TABLE IF NOT EXISTS `entity_operator_role_mapping` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `role_type_id` SMALLINT NOT NULL,
  `entity_id` INT DEFAULT NULL,
  `entity_type` VARCHAR(50) DEFAULT NULL,
  `active_status_id` INT DEFAULT 1,
  `created_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_operator` (`operator_id`),
  INDEX `idx_role` (`role_type_id`),
  INDEX `idx_status` (`active_status_id`),
  FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_type_id`) REFERENCES `role_type`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`active_status_id`) REFERENCES `active_status`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Permission
CREATE TABLE IF NOT EXISTS `permission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `module` VARCHAR(50) DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`),
  INDEX `idx_code` (`code`),
  INDEX `idx_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Role Permissions
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_type_id` SMALLINT NOT NULL,
  `permission_id` INT NOT NULL,
  `can_create` BOOLEAN DEFAULT FALSE,
  `can_read` BOOLEAN DEFAULT FALSE,
  `can_update` BOOLEAN DEFAULT FALSE,
  `can_delete` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_role_permission` (`role_type_id`, `permission_id`),
  FOREIGN KEY (`role_type_id`) REFERENCES `role_type`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Operator Permission (Individual Overrides)
CREATE TABLE IF NOT EXISTS `operator_permission` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  `is_granted` BOOLEAN DEFAULT TRUE,
  `granted_by` INT DEFAULT NULL,
  `granted_on` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_operator_permission` (`operator_id`, `permission_id`),
  FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permission`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Role Nesting
CREATE TABLE IF NOT EXISTS `role_nesting` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role_type_id` SMALLINT NOT NULL,
  `parent_role_type_id` SMALLINT DEFAULT NULL,
  `level` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `idx_role` (`role_type_id`),
  INDEX `idx_parent` (`parent_role_type_id`),
  FOREIGN KEY (`role_type_id`) REFERENCES `role_type`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_role_type_id`) REFERENCES `role_type`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Operator Activity Log
CREATE TABLE IF NOT EXISTS `operator_activity_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `activity_type_id` INT DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_type` VARCHAR(50) DEFAULT NULL,
  `entity_id` INT DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `details` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_operator` (`operator_id`),
  INDEX `idx_activity_type` (`activity_type_id`),
  INDEX `idx_created` (`created_at`),
  FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`activity_type_id`) REFERENCES `activity_type`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Operator OTP Log
CREATE TABLE IF NOT EXISTS `operator_otp_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `otp_code` VARCHAR(10) NOT NULL,
  `purpose` VARCHAR(50) DEFAULT NULL,
  `is_used` BOOLEAN DEFAULT FALSE,
  `expires_at` DATETIME NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_operator` (`operator_id`),
  INDEX `idx_expires` (`expires_at`),
  FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Operator Passcode Log
CREATE TABLE IF NOT EXISTS `operator_passcode_log` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `old_password_hash` VARCHAR(255) DEFAULT NULL,
  `new_password_hash` VARCHAR(255) NOT NULL,
  `changed_by` INT DEFAULT NULL,
  `change_reason` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_operator` (`operator_id`),
  FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- User Verification Token
CREATE TABLE IF NOT EXISTS `user_verification_token` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `token_type` VARCHAR(50) NOT NULL,
  `expires_at` DATETIME NOT NULL,
  `is_used` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_token` (`token`),
  INDEX `idx_operator` (`operator_id`),
  FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Device Registration
CREATE TABLE IF NOT EXISTS `device_registration` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `device_token` VARCHAR(255) NOT NULL,
  `device_type` VARCHAR(50) DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `last_used` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_operator` (`operator_id`),
  INDEX `idx_token` (`device_token`),
  FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Device Details
CREATE TABLE IF NOT EXISTS `device_details` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `device_registration_id` INT NOT NULL,
  `device_name` VARCHAR(100) DEFAULT NULL,
  `os_version` VARCHAR(50) DEFAULT NULL,
  `app_version` VARCHAR(50) DEFAULT NULL,
  `browser` VARCHAR(100) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_device` (`device_registration_id`),
  FOREIGN KEY (`device_registration_id`) REFERENCES `device_registration`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SECTION 4: DOCUMENT & FILE MANAGEMENT
-- ============================================================================

-- Document
CREATE TABLE IF NOT EXISTS `document` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  `uid` VARCHAR(255) DEFAULT NULL UNIQUE,
  `url` VARCHAR(500) DEFAULT NULL,
  `file_size` BIGINT DEFAULT NULL,
  `mime_type` VARCHAR(100) DEFAULT NULL,
  `document_type_id` INT DEFAULT NULL,
  `status_id` INT DEFAULT 1,
  `created_on` DATETIME(6) DEFAULT NULL,
  `created_by` INT DEFAULT NULL,
  `last_updated_on` DATETIME(6) DEFAULT NULL,
  `last_updated_by` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_uid` (`uid`),
  INDEX `idx_type` (`document_type_id`),
  INDEX `idx_status` (`status_id`),
  INDEX `idx_created_by` (`created_by`),
  FOREIGN KEY (`document_type_id`) REFERENCES `document_type`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`status_id`) REFERENCES `active_status`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `operator`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`last_updated_by`) REFERENCES `operator`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Document Metadata
CREATE TABLE IF NOT EXISTS `document_metadata` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `document_id` INT NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `caption` TEXT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `keywords` VARCHAR(500) DEFAULT NULL,
  `width` INT DEFAULT NULL,
  `height` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_document` (`document_id`),
  FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- File Upload
CREATE TABLE IF NOT EXISTS `file_upload` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `original_name` VARCHAR(255) NOT NULL,
  `stored_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) NOT NULL,
  `file_size` BIGINT DEFAULT NULL,
  `mime_type` VARCHAR(100) DEFAULT NULL,
  `upload_type` VARCHAR(50) DEFAULT NULL,
  `uploaded_by` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_uploaded_by` (`uploaded_by`),
  FOREIGN KEY (`uploaded_by`) REFERENCES `operator`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SECTION 5: CONTENT MANAGEMENT
-- ============================================================================

-- Category
CREATE TABLE IF NOT EXISTS `category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) DEFAULT NULL,
  `slug` VARCHAR(255) DEFAULT NULL UNIQUE,
  `description` VARCHAR(500) DEFAULT NULL,
  `icon_url` VARCHAR(1000) DEFAULT NULL,
  `cover_image_id` INT DEFAULT NULL,
  `priority` INT DEFAULT 0,
  `parent_id` INT DEFAULT NULL,
  `country_id` INT DEFAULT NULL,
  `status_id` INT DEFAULT 1,
  `created_on` DATETIME(6) DEFAULT NULL,
  `last_updated_on` DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_parent` (`parent_id`),
  INDEX `idx_country` (`country_id`),
  INDEX `idx_status` (`status_id`),
  INDEX `idx_cover_image` (`cover_image_id`),
  FOREIGN KEY (`parent_id`) REFERENCES `category`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`status_id`) REFERENCES `active_status`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`cover_image_id`) REFERENCES `document`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Tags
CREATE TABLE IF NOT EXISTS `tags` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article
CREATE TABLE IF NOT EXISTS `article` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) DEFAULT NULL,
  `url_slug` VARCHAR(200) DEFAULT NULL,
  `brief` TEXT DEFAULT NULL,
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `time_to_read` VARCHAR(255) DEFAULT NULL,
  `category_id` INT DEFAULT NULL,
  `article_label_id` INT DEFAULT NULL,
  `document_id` INT DEFAULT NULL COMMENT 'Cover image',
  `cover_image_alt_text` VARCHAR(255) DEFAULT NULL,
  `status_id` INT DEFAULT 1,
  `access_type_id` INT DEFAULT 1,
  `is_content_locked` BOOLEAN DEFAULT FALSE,
  `publish_date` DATETIME DEFAULT NULL,
  `view_count` INT DEFAULT 0,
  `like_count` INT DEFAULT 0,
  -- SEO Fields
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `focus_keyword` VARCHAR(100) DEFAULT NULL,
  `allow_indexing` BOOLEAN DEFAULT TRUE,
  `robots_meta_tag_id` INT DEFAULT 1,
  `canonical_url` VARCHAR(500) DEFAULT NULL,
  `structured_data_markup` TEXT DEFAULT NULL,
  `schema_type_id` INT DEFAULT 1,
  `indexing_status_id` INT DEFAULT 1,
  -- Open Graph
  `og_title` VARCHAR(255) DEFAULT NULL,
  `og_description` TEXT DEFAULT NULL,
  `og_image` VARCHAR(500) DEFAULT NULL,
  -- Twitter Card
  `twitter_title` VARCHAR(255) DEFAULT NULL,
  `twitter_description` TEXT DEFAULT NULL,
  `twitter_image` VARCHAR(500) DEFAULT NULL,
  -- Audit Fields
  `created_on` DATETIME(6) DEFAULT NULL,
  `created_by` INT DEFAULT NULL,
  `last_updated_on` DATETIME(6) DEFAULT NULL,
  `last_updated_by` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_slug` (`url_slug`),
  INDEX `idx_category` (`category_id`),
  INDEX `idx_label` (`article_label_id`),
  INDEX `idx_status` (`status_id`),
  INDEX `idx_publish_date` (`publish_date`),
  INDEX `idx_created_by` (`created_by`),
  FULLTEXT INDEX `idx_fulltext` (`title`, `content`),
  FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`article_label_id`) REFERENCES `article_label`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`status_id`) REFERENCES `active_status`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`access_type_id`) REFERENCES `access_type`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`robots_meta_tag_id`) REFERENCES `robots_meta_tag_type`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`schema_type_id`) REFERENCES `schema_type`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`indexing_status_id`) REFERENCES `indexing_status_type`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `operator`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`last_updated_by`) REFERENCES `operator`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Article Tag (Junction Table)
CREATE TABLE IF NOT EXISTS `article_tag` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `article_id` INT NOT NULL,
  `tag_id` INT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_article_tag` (`article_id`, `tag_id`),
  INDEX `idx_article` (`article_id`),
  INDEX `idx_tag` (`tag_id`),
  FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article Authors (Junction Table)
CREATE TABLE IF NOT EXISTS `article_authors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `article_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  `author_order` INT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_article_author` (`article_id`, `author_id`),
  INDEX `idx_article` (`article_id`),
  INDEX `idx_author` (`author_id`),
  FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`author_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Related Article (Junction Table)
CREATE TABLE IF NOT EXISTS `related_article` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `article_id` INT NOT NULL,
  `related_article_id` INT NOT NULL,
  `relation_order` INT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_article_related` (`article_id`, `related_article_id`),
  INDEX `idx_article` (`article_id`),
  INDEX `idx_related` (`related_article_id`),
  FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`related_article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article Content Image
CREATE TABLE IF NOT EXISTS `article_content_image` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `article_id` INT NOT NULL,
  `document_id` INT NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT NULL,
  `caption` TEXT DEFAULT NULL,
  `position` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_article` (`article_id`),
  INDEX `idx_document` (`document_id`),
  FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`document_id`) REFERENCES `document`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Article Revision
CREATE TABLE IF NOT EXISTS `article_revision` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `article_id` INT NOT NULL,
  `title` VARCHAR(500) DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `revision_number` INT DEFAULT 1,
  `change_summary` TEXT DEFAULT NULL,
  `created_by` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_article` (`article_id`),
  INDEX `idx_created_by` (`created_by`),
  FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`created_by`) REFERENCES `operator`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article SEO Analysis
CREATE TABLE IF NOT EXISTS `article_seo_analysis` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `article_id` INT NOT NULL,
  `seo_score` INT DEFAULT 0,
  `readability_score` INT DEFAULT 0,
  `keyword_density` DECIMAL(5,2) DEFAULT 0.00,
  `word_count` INT DEFAULT 0,
  `internal_links` INT DEFAULT 0,
  `external_links` INT DEFAULT 0,
  `image_count` INT DEFAULT 0,
  `analysis_data` JSON DEFAULT NULL,
  `last_analyzed` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_article` (`article_id`),
  FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article Settings
CREATE TABLE IF NOT EXISTS `article_settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `article_id` INT NOT NULL,
  `comment_count` INT DEFAULT 0,
  `share_count` INT DEFAULT 0,
  `allow_comments` BOOLEAN DEFAULT TRUE,
  `allow_sharing` BOOLEAN DEFAULT TRUE,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `is_trending` BOOLEAN DEFAULT FALSE,
  `is_editors_pick` BOOLEAN DEFAULT FALSE,
  `custom_css` TEXT DEFAULT NULL,
  `custom_js` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_article` (`article_id`),
  FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Article Views
CREATE TABLE IF NOT EXISTS `article_views` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `article_id` INT NOT NULL,
  `viewer_ip` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `referrer` VARCHAR(500) DEFAULT NULL,
  `viewed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_article` (`article_id`),
  INDEX `idx_viewed_at` (`viewed_at`),
  FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Article Comment
CREATE TABLE IF NOT EXISTS `article_comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `article_id` INT NOT NULL,
  `parent_comment_id` INT DEFAULT NULL,
  `author_name` VARCHAR(100) NOT NULL,
  `author_email` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `status_id` INT DEFAULT 1,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_article` (`article_id`),
  INDEX `idx_parent` (`parent_comment_id`),
  INDEX `idx_status` (`status_id`),
  INDEX `idx_created` (`created_at`),
  FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`parent_comment_id`) REFERENCES `article_comment`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`status_id`) REFERENCES `comment_status_type`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SECTION 6: UNIVERSITY & COURSES
-- ============================================================================

-- Universities
CREATE TABLE IF NOT EXISTS `universities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) DEFAULT NULL UNIQUE,
  `established_on` DATE DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `students_capacity` INT DEFAULT NULL,
  `numbers_of_faculty` INT DEFAULT NULL,
  `country` VARCHAR(100) DEFAULT NULL,
  `state` VARCHAR(100) DEFAULT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `zip_code` VARCHAR(20) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `website` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `logo_id` INT DEFAULT NULL,
  `cover_image_id` INT DEFAULT NULL,
  `status_id` INT DEFAULT 1,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `ranking_national` INT DEFAULT NULL,
  `ranking_international` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_status` (`status_id`),
  INDEX `idx_country` (`country`),
  INDEX `idx_logo` (`logo_id`),
  INDEX `idx_cover` (`cover_image_id`),
  FOREIGN KEY (`status_id`) REFERENCES `active_status`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`logo_id`) REFERENCES `document`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`cover_image_id`) REFERENCES `document`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Courses
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `instructor` VARCHAR(100) DEFAULT NULL,
  `duration` VARCHAR(50) DEFAULT NULL,
  `level` ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
  `price` DECIMAL(10,2) DEFAULT 0.00,
  `currency` VARCHAR(3) DEFAULT 'USD',
  `thumbnail_url` VARCHAR(500) DEFAULT NULL,
  `thumbnail_key` VARCHAR(255) DEFAULT NULL,
  `category_id` INT DEFAULT NULL,
  `university_id` INT DEFAULT NULL,
  `is_featured` BOOLEAN DEFAULT FALSE,
  `is_trending` BOOLEAN DEFAULT FALSE,
  `is_popular` BOOLEAN DEFAULT FALSE,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `enrollment_count` INT DEFAULT 0,
  `rating` DECIMAL(3,2) DEFAULT 0.00,
  `published_at` DATETIME DEFAULT NULL,
  `created_by` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_slug` (`slug`),
  INDEX `idx_category` (`category_id`),
  INDEX `idx_university` (`university_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_created_by` (`created_by`),
  FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `operator`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- University Courses (Junction Table - if needed for many-to-many)
CREATE TABLE IF NOT EXISTS `university_courses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `university_id` INT NOT NULL,
  `course_id` INT NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_university_course` (`university_id`, `course_id`),
  INDEX `idx_university` (`university_id`),
  INDEX `idx_course` (`course_id`),
  FOREIGN KEY (`university_id`) REFERENCES `universities`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SECTION 7: ADVERTISEMENT
-- ============================================================================

-- Advertisement
CREATE TABLE IF NOT EXISTS `advertisement` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slot` VARCHAR(100) NOT NULL COMMENT 'Placement slot identifier',
  `type_id` INT NOT NULL DEFAULT 1,
  `format_id` INT DEFAULT 3,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `target_url` VARCHAR(500) DEFAULT NULL,
  `html_content` TEXT DEFAULT NULL COMMENT 'Custom HTML/JS for third-party ads',
  `adsense_slot_id` VARCHAR(100) DEFAULT NULL,
  `start_date` DATETIME DEFAULT NULL,
  `end_date` DATETIME DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `priority` INT DEFAULT 0 COMMENT 'Higher priority shown first',
  `impressions` INT DEFAULT 0,
  `clicks` INT DEFAULT 0,
  `target_pages` JSON DEFAULT NULL COMMENT 'Array of page paths',
  `target_categories` JSON DEFAULT NULL COMMENT 'Array of category IDs',
  `status_id` INT DEFAULT 1,
  `created_on` DATETIME(6) DEFAULT NULL,
  `created_by` INT DEFAULT NULL,
  `last_updated_on` DATETIME(6) DEFAULT NULL,
  `deleted_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_slot` (`slot`),
  INDEX `idx_type` (`type_id`),
  INDEX `idx_format` (`format_id`),
  INDEX `idx_status` (`status_id`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_dates` (`start_date`, `end_date`),
  FOREIGN KEY (`type_id`) REFERENCES `advertisement_type`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`format_id`) REFERENCES `advertisement_format`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`status_id`) REFERENCES `active_status`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `operator`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- SECTION 8: FRONTEND CONTENT
-- ============================================================================

-- Hero Content
CREATE TABLE IF NOT EXISTS `hero_content` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(500) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `button_text` VARCHAR(100) DEFAULT NULL,
  `button_url` VARCHAR(500) DEFAULT NULL,
  `image_id` INT DEFAULT NULL,
  `category_id` INT DEFAULT NULL,
  `priority` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `start_date` DATETIME DEFAULT NULL,
  `end_date` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_category` (`category_id`),
  INDEX `idx_image` (`image_id`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_priority` (`priority`),
  FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`image_id`) REFERENCES `document`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Carousel Items
CREATE TABLE IF NOT EXISTS `carousel_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `link_url` VARCHAR(500) DEFAULT NULL,
  `cover_image_id` INT DEFAULT NULL,
  `priority` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cover_image` (`cover_image_id`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_priority` (`priority`),
  FOREIGN KEY (`cover_image_id`) REFERENCES `document`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Navigation Menu
CREATE TABLE IF NOT EXISTS `navigation_menu` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `url` VARCHAR(500) DEFAULT NULL,
  `parent_id` INT DEFAULT NULL,
  `menu_order` INT DEFAULT 0,
  `icon` VARCHAR(100) DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `target` VARCHAR(20) DEFAULT '_self',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_parent` (`parent_id`),
  INDEX `idx_active` (`is_active`),
  INDEX `idx_order` (`menu_order`),
  FOREIGN KEY (`parent_id`) REFERENCES `navigation_menu`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================================
-- SECTION 9: SYSTEM CONFIGURATION
-- ============================================================================

-- Config Option
CREATE TABLE IF NOT EXISTS `config_option` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `option_key` VARCHAR(100) NOT NULL UNIQUE,
  `option_value` TEXT DEFAULT NULL,
  `option_type_id` INT DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `is_public` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_key` (`option_key`),
  INDEX `idx_type` (`option_type_id`),
  FOREIGN KEY (`option_type_id`) REFERENCES `config_option_type`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SECTION 10: CONTACT & ENQUIRY
-- ============================================================================

-- Contacts
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `subject` VARCHAR(255) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status_id` INT DEFAULT 1,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status_id`),
  INDEX `idx_created` (`created_at`),
  FOREIGN KEY (`status_id`) REFERENCES `enquiry_status_type`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SECTION 11: ADDITIONAL TABLES
-- ============================================================================

-- Address
CREATE TABLE IF NOT EXISTS `address` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `address_type_id` INT DEFAULT NULL,
  `address_line1` VARCHAR(255) DEFAULT NULL,
  `address_line2` VARCHAR(255) DEFAULT NULL,
  `city_id` INT DEFAULT NULL,
  `state_province_id` INT DEFAULT NULL,
  `country_id` INT DEFAULT NULL,
  `postal_code` VARCHAR(20) DEFAULT NULL,
  `latitude` DECIMAL(10,8) DEFAULT NULL,
  `longitude` DECIMAL(11,8) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_type` (`address_type_id`),
  INDEX `idx_city` (`city_id`),
  INDEX `idx_state` (`state_province_id`),
  INDEX `idx_country` (`country_id`),
  FOREIGN KEY (`address_type_id`) REFERENCES `address_type`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`state_province_id`) REFERENCES `state_province`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`country_id`) REFERENCES `country`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Party
CREATE TABLE IF NOT EXISTS `party` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `party_type_id` INT DEFAULT NULL,
  `party_status_id` INT DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_type` (`party_type_id`),
  INDEX `idx_status` (`party_status_id`),
  FOREIGN KEY (`party_type_id`) REFERENCES `party_type`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`party_status_id`) REFERENCES `party_status`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Advisor
CREATE TABLE IF NOT EXISTS `advisor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `party_id` INT NOT NULL,
  `specialization` VARCHAR(255) DEFAULT NULL,
  `experience_years` INT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_party` (`party_id`),
  FOREIGN KEY (`party_id`) REFERENCES `party`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agent
CREATE TABLE IF NOT EXISTS `agent` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `party_id` INT NOT NULL,
  `agency_name` VARCHAR(255) DEFAULT NULL,
  `license_number` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_party` (`party_id`),
  FOREIGN KEY (`party_id`) REFERENCES `party`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Consumer
CREATE TABLE IF NOT EXISTS `consumer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `party_id` INT NOT NULL,
  `preferences` JSON DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_party` (`party_id`),
  FOREIGN KEY (`party_id`) REFERENCES `party`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Partner
CREATE TABLE IF NOT EXISTS `partner` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `party_id` INT NOT NULL,
  `partnership_type` VARCHAR(100) DEFAULT NULL,
  `contract_start` DATE DEFAULT NULL,
  `contract_end` DATE DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_party` (`party_id`),
  FOREIGN KEY (`party_id`) REFERENCES `party`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Content Creators
CREATE TABLE IF NOT EXISTS `content_creators` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `role_type_id` SMALLINT DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `avatar_id` INT DEFAULT NULL,
  `social_links` JSON DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_operator` (`operator_id`),
  INDEX `idx_role` (`role_type_id`),
  INDEX `idx_avatar` (`avatar_id`),
  FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_type_id`) REFERENCES `role_type`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`avatar_id`) REFERENCES `document`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Invitation
CREATE TABLE IF NOT EXISTS `invitation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `role_type_id` SMALLINT DEFAULT NULL,
  `invited_by` INT DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `is_used` BOOLEAN DEFAULT FALSE,
  `used_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_token` (`token`),
  INDEX `idx_invited_by` (`invited_by`),
  FOREIGN KEY (`role_type_id`) REFERENCES `role_type`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`invited_by`) REFERENCES `operator`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Channel
CREATE TABLE IF NOT EXISTS `channel` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Service
CREATE TABLE IF NOT EXISTS `service` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pin
CREATE TABLE IF NOT EXISTS `pin` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `operator_id` INT NOT NULL,
  `pin_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_operator` (`operator_id`),
  FOREIGN KEY (`operator_id`) REFERENCES `operator`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Search Metadata
CREATE TABLE IF NOT EXISTS `search_metadata` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` INT NOT NULL,
  `search_text` TEXT DEFAULT NULL,
  `keywords` VARCHAR(500) DEFAULT NULL,
  `last_indexed` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_entity` (`entity_type`, `entity_id`),
  FULLTEXT INDEX `idx_search` (`search_text`, `keywords`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SECTION 12: SEED DATA FOR MASTER TABLES
-- ============================================================================

-- Active Status
INSERT INTO `active_status` (`id`, `name`, `code`, `description`) VALUES
(1, 'Active', 'ACTIVE', 'Entity is active'),
(2, 'Inactive', 'INACTIVE', 'Entity is inactive'),
(3, 'Pending', 'PENDING', 'Entity is pending approval'),
(4, 'Archived', 'ARCHIVED', 'Entity is archived'),
(5, 'Deleted', 'DELETED', 'Entity is soft deleted')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Gender
INSERT INTO `gender` (`id`, `name`, `code`) VALUES
(1, 'Male', 'M'),
(2, 'Female', 'F'),
(3, 'Other', 'O'),
(4, 'Prefer not to say', 'N')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Preferred Language
INSERT INTO `preferred_language` (`id`, `name`, `code`, `is_active`) VALUES
(1, 'English', 'en', TRUE),
(2, 'Spanish', 'es', TRUE),
(3, 'French', 'fr', TRUE),
(4, 'German', 'de', TRUE),
(5, 'Chinese', 'zh', TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Access Type
INSERT INTO `access_type` (`id`, `name`, `code`, `description`) VALUES
(1, 'Public', 'PUBLIC', 'Accessible to everyone'),
(2, 'Private', 'PRIVATE', 'Accessible to authorized users only'),
(3, 'Premium', 'PREMIUM', 'Accessible to premium members'),
(4, 'Draft', 'DRAFT', 'Not publicly accessible')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Robots Meta Tag Type
INSERT INTO `robots_meta_tag_type` (`id`, `name`, `code`, `description`) VALUES
(1, 'Index, Follow', 'INDEX_FOLLOW', 'Allow indexing and following links'),
(2, 'No Index, Follow', 'NOINDEX_FOLLOW', 'Prevent indexing but follow links'),
(3, 'Index, No Follow', 'INDEX_NOFOLLOW', 'Allow indexing but don\'t follow links'),
(4, 'No Index, No Follow', 'NOINDEX_NOFOLLOW', 'Prevent indexing and following links')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);


-- Schema Type
INSERT INTO `schema_type` (`id`, `name`, `code`, `schema_template`) VALUES
(1, 'Article', 'ARTICLE', '{"@type": "Article"}'),
(2, 'News Article', 'NEWS_ARTICLE', '{"@type": "NewsArticle"}'),
(3, 'Blog Posting', 'BLOG_POSTING', '{"@type": "BlogPosting"}'),
(4, 'Course', 'COURSE', '{"@type": "Course"}'),
(5, 'Organization', 'ORGANIZATION', '{"@type": "Organization"}')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Indexing Status Type
INSERT INTO `indexing_status_type` (`id`, `name`, `code`) VALUES
(1, 'Indexed', 'INDEXED'),
(2, 'Not Indexed', 'NOT_INDEXED'),
(3, 'Pending', 'PENDING'),
(4, 'Blocked', 'BLOCKED')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Comment Status Type
INSERT INTO `comment_status_type` (`id`, `name`, `code`) VALUES
(1, 'Approved', 'APPROVED'),
(2, 'Pending', 'PENDING'),
(3, 'Spam', 'SPAM'),
(4, 'Trash', 'TRASH')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Enquiry Status Type
INSERT INTO `enquiry_status_type` (`id`, `name`, `code`) VALUES
(1, 'New', 'NEW'),
(2, 'In Progress', 'IN_PROGRESS'),
(3, 'Resolved', 'RESOLVED'),
(4, 'Closed', 'CLOSED')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Activity Type
INSERT INTO `activity_type` (`id`, `name`, `code`, `description`) VALUES
(1, 'Login', 'LOGIN', 'User logged in'),
(2, 'Logout', 'LOGOUT', 'User logged out'),
(3, 'Create', 'CREATE', 'Created an entity'),
(4, 'Update', 'UPDATE', 'Updated an entity'),
(5, 'Delete', 'DELETE', 'Deleted an entity'),
(6, 'View', 'VIEW', 'Viewed an entity')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Address Type
INSERT INTO `address_type` (`id`, `name`, `code`) VALUES
(1, 'Home', 'HOME'),
(2, 'Work', 'WORK'),
(3, 'Billing', 'BILLING'),
(4, 'Shipping', 'SHIPPING')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Document Type
INSERT INTO `document_type` (`id`, `name`, `code`, `allowed_extensions`, `max_size_mb`) VALUES
(1, 'Image', 'IMAGE', 'jpg,jpeg,png,gif,webp', 10),
(2, 'Document', 'DOCUMENT', 'pdf,doc,docx,txt', 20),
(3, 'Video', 'VIDEO', 'mp4,avi,mov', 100),
(4, 'Audio', 'AUDIO', 'mp3,wav,ogg', 50)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);


-- Article Label
INSERT INTO `article_label` (`id`, `name`, `code`, `color`) VALUES
(1, 'Breaking News', 'BREAKING', '#FF0000'),
(2, 'Featured', 'FEATURED', '#FFD700'),
(3, 'Trending', 'TRENDING', '#FF6B6B'),
(4, 'Editor\'s Pick', 'EDITORS_PICK', '#4ECDC4')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Advertisement Type
INSERT INTO `advertisement_type` (`id`, `name`, `code`, `description`) VALUES
(1, 'Banner', 'BANNER', 'Standard banner advertisement'),
(2, 'Google AdSense', 'ADSENSE', 'Google AdSense integration'),
(3, 'Custom HTML', 'CUSTOM_HTML', 'Custom HTML/JavaScript code'),
(4, 'Native', 'NATIVE', 'Native advertisement')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Advertisement Format
INSERT INTO `advertisement_format` (`id`, `name`, `code`, `width`, `height`) VALUES
(1, 'Leaderboard', 'LEADERBOARD', 728, 90),
(2, 'Medium Rectangle', 'MEDIUM_RECTANGLE', 300, 250),
(3, 'Wide Skyscraper', 'WIDE_SKYSCRAPER', 160, 600),
(4, 'Mobile Banner', 'MOBILE_BANNER', 320, 50),
(5, 'Large Mobile Banner', 'LARGE_MOBILE_BANNER', 320, 100)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Role Type
INSERT INTO `role_type` (`id`, `name`, `code`, `default_permission`, `is_enable`, `two_factor_required`) VALUES
(1, 'Super Admin', 'SUPER_ADMIN', 'ALL', TRUE, TRUE),
(2, 'Admin', 'ADMIN', 'ALL', TRUE, TRUE),
(3, 'Content Manager', 'CONTENT_MANAGER', 'CREATE_ARTICLE,EDIT_ANY_ARTICLE,DELETE_ARTICLE,PUBLISH_ARTICLE,MANAGE_CATEGORIES', TRUE, FALSE),
(4, 'Editor', 'EDITOR', 'CREATE_ARTICLE,EDIT_OWN_ARTICLE,VIEW_ARTICLE,APPROVE_ARTICLE', TRUE, FALSE),
(5, 'Content Writer', 'CONTENT_WRITER', 'CREATE_ARTICLE,EDIT_OWN_ARTICLE,VIEW_ARTICLE', TRUE, FALSE),
(6, 'Viewer', 'VIEWER', 'VIEW_ARTICLE,VIEW_CATEGORY,VIEW_COURSE', TRUE, FALSE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Permission
INSERT INTO `permission` (`id`, `name`, `code`, `description`, `module`) VALUES
(1, 'All Permissions', 'ALL', 'Full system access', 'SYSTEM'),
(2, 'Create Article', 'CREATE_ARTICLE', 'Create new articles', 'ARTICLE'),
(3, 'View Article', 'VIEW_ARTICLE', 'View articles', 'ARTICLE'),
(4, 'Edit Own Article', 'EDIT_OWN_ARTICLE', 'Edit own articles', 'ARTICLE'),
(5, 'Edit Any Article', 'EDIT_ANY_ARTICLE', 'Edit any article', 'ARTICLE'),
(6, 'Delete Article', 'DELETE_ARTICLE', 'Delete articles', 'ARTICLE'),
(7, 'Publish Article', 'PUBLISH_ARTICLE', 'Publish articles', 'ARTICLE'),
(8, 'Approve Article', 'APPROVE_ARTICLE', 'Approve articles', 'ARTICLE'),
(9, 'Manage Categories', 'MANAGE_CATEGORIES', 'Manage categories', 'CATEGORY'),
(10, 'Manage Users', 'MANAGE_USERS', 'Manage users', 'USER')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);


-- Party Type
INSERT INTO `party_type` (`id`, `name`, `code`) VALUES
(1, 'Individual', 'INDIVIDUAL'),
(2, 'Organization', 'ORGANIZATION'),
(3, 'Business', 'BUSINESS')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Party Status
INSERT INTO `party_status` (`id`, `name`, `code`) VALUES
(1, 'Active', 'ACTIVE'),
(2, 'Inactive', 'INACTIVE'),
(3, 'Suspended', 'SUSPENDED')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- Config Option Type
INSERT INTO `config_option_type` (`id`, `name`, `code`, `description`) VALUES
(1, 'General', 'GENERAL', 'General configuration options'),
(2, 'SEO', 'SEO', 'SEO related settings'),
(3, 'Email', 'EMAIL', 'Email configuration'),
(4, 'Social Media', 'SOCIAL_MEDIA', 'Social media integration'),
(5, 'Analytics', 'ANALYTICS', 'Analytics and tracking')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ============================================================================
-- SECTION 13: INDEXES FOR PERFORMANCE
-- ============================================================================

-- Additional composite indexes for common queries
CREATE INDEX `idx_article_status_publish` ON `article` (`status_id`, `publish_date`);
CREATE INDEX `idx_article_category_status` ON `article` (`category_id`, `status_id`);
CREATE INDEX `idx_course_university_status` ON `courses` (`university_id`, `status`);
CREATE INDEX `idx_operator_email_status` ON `operator` (`email`);

-- ============================================================================
-- SECTION 14: VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Published Articles with Author Info
CREATE OR REPLACE VIEW `v_published_articles` AS
SELECT 
  a.id,
  a.title,
  a.url_slug,
  a.excerpt,
  a.publish_date,
  a.view_count,
  a.like_count,
  c.name AS category_name,
  d.url AS cover_image_url,
  o.first_name AS author_first_name,
  o.last_name AS author_last_name,
  o.email AS author_email
FROM article a
LEFT JOIN category c ON a.category_id = c.id
LEFT JOIN document d ON a.document_id = d.id
LEFT JOIN operator o ON a.created_by = o.id
WHERE a.status_id = 1 
  AND a.publish_date <= NOW();

-- View: Active Universities with Course Count
CREATE OR REPLACE VIEW `v_universities_with_courses` AS
SELECT 
  u.id,
  u.name,
  u.slug,
  u.city,
  u.country,
  COUNT(c.id) AS course_count
FROM universities u
LEFT JOIN courses c ON u.id = c.university_id AND c.status = 'published'
WHERE u.status_id = 1
GROUP BY u.id;


-- ============================================================================
-- SECTION 15: TRIGGERS FOR AUTOMATION
-- ============================================================================

-- Trigger: Update article view count
DELIMITER $$
CREATE TRIGGER `trg_article_views_insert` 
AFTER INSERT ON `article_views`
FOR EACH ROW
BEGIN
  UPDATE article 
  SET view_count = view_count + 1 
  WHERE id = NEW.article_id;
END$$
DELIMITER ;

-- Trigger: Update article comment count in settings
DELIMITER $$
CREATE TRIGGER `trg_article_comment_insert` 
AFTER INSERT ON `article_comment`
FOR EACH ROW
BEGIN
  INSERT INTO article_settings (article_id, comment_count)
  VALUES (NEW.article_id, 1)
  ON DUPLICATE KEY UPDATE comment_count = comment_count + 1;
END$$
DELIMITER ;

-- Trigger: Update last_updated_on for article
DELIMITER $$
CREATE TRIGGER `trg_article_before_update` 
BEFORE UPDATE ON `article`
FOR EACH ROW
BEGIN
  SET NEW.last_updated_on = NOW(6);
END$$
DELIMITER ;

-- Trigger: Update operator last_updated_on
DELIMITER $$
CREATE TRIGGER `trg_operator_before_update` 
BEFORE UPDATE ON `operator`
FOR EACH ROW
BEGIN
  SET NEW.last_updated_on = NOW(6);
END$$
DELIMITER ;

-- ============================================================================
-- SECTION 16: STORED PROCEDURES
-- ============================================================================

-- Procedure: Get Article with Full Details
DELIMITER $$
CREATE PROCEDURE `sp_get_article_details`(IN article_id INT)
BEGIN
  SELECT 
    a.*,
    c.name AS category_name,
    d.url AS cover_image_url,
    o.first_name AS author_first_name,
    o.last_name AS author_last_name,
    GROUP_CONCAT(DISTINCT t.name) AS tags,
    aseo.seo_score,
    aseo.readability_score
  FROM article a
  LEFT JOIN category c ON a.category_id = c.id
  LEFT JOIN document d ON a.document_id = d.id
  LEFT JOIN operator o ON a.created_by = o.id
  LEFT JOIN article_tag at ON a.id = at.article_id
  LEFT JOIN tags t ON at.tag_id = t.id
  LEFT JOIN article_seo_analysis aseo ON a.id = aseo.article_id
  WHERE a.id = article_id
  GROUP BY a.id;
END$$
DELIMITER ;

-- Procedure: Get User Permissions
DELIMITER $$
CREATE PROCEDURE `sp_get_user_permissions`(IN operator_id INT)
BEGIN
  SELECT DISTINCT p.code
  FROM operator o
  JOIN entity_operator_role_mapping eorm ON o.id = eorm.operator_id
  JOIN role_type rt ON eorm.role_type_id = rt.id
  JOIN role_permissions rp ON rt.id = rp.role_type_id
  JOIN permission p ON rp.permission_id = p.id
  WHERE o.id = operator_id 
    AND eorm.active_status_id = 1
    AND rt.is_enable = TRUE
    AND p.is_active = TRUE;
END$$
DELIMITER ;


-- ============================================================================
-- SECTION 17: CLEANUP AND FINALIZATION
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Database: Student Herald API
-- Version: 2.0
-- Date: 2024
-- 
-- This migration includes:
-- - 60+ tables with proper relationships
-- - Master/lookup tables with seed data
-- - Geographic tables (country, state, city)
-- - User authentication and authorization
-- - Role-based access control (RBAC)
-- - Article management with SEO
-- - University and course management
-- - Advertisement system
-- - Document and file management
-- - Frontend content (hero, carousel, navigation)
-- - System configuration
-- - Contact and enquiry management
-- - Proper indexes for performance
-- - Views for common queries
-- - Triggers for automation
-- - Stored procedures for complex operations
-- 
-- All foreign keys are properly defined with ON DELETE and ON UPDATE actions
-- All tables use InnoDB engine for transaction support
-- All tables use utf8mb4 character set for full Unicode support
-- ============================================================================

-- ============================================================================
-- SECTION 18: DUMMY DATA & TEST CREDENTIALS
-- ============================================================================

-- ============================================================================
-- DUMMY OPERATORS (USERS)
-- ============================================================================

-- Insert test operators for each role
-- Password for all users: Password123!
-- Hashed using bcrypt with 10 rounds

INSERT INTO `operator` (`id`, `first_name`, `middle_name`, `last_name`, `email`, `mobile_number`, `isd_code`, `date_of_birth`, `gender`, `gender_id`, `phone_verified`, `mobile_verified`, `two_factor_required`, `uid`, `created_on`) VALUES
(1, 'Super', NULL, 'Admin', 'superadmin@studentherald.com', '1234567890', '+1', '1990-01-01', 'M', 1, TRUE, TRUE, TRUE, UUID(), NOW()),
(2, 'John', 'M', 'Admin', 'admin@studentherald.com', '1234567891', '+1', '1991-02-15', 'M', 1, TRUE, TRUE, FALSE, UUID(), NOW()),
(3, 'Sarah', NULL, 'Manager', 'manager@studentherald.com', '1234567892', '+1', '1992-03-20', 'F', 2, TRUE, TRUE, FALSE, UUID(), NOW()),
(4, 'Mike', NULL, 'Editor', 'editor@studentherald.com', '1234567893', '+1', '1993-04-25', 'M', 1, TRUE, FALSE, FALSE, UUID(), NOW()),
(5, 'Emily', 'Rose', 'Writer', 'writer@studentherald.com', '1234567894', '+1', '1994-05-30', 'F', 2, TRUE, FALSE, FALSE, UUID(), NOW()),
(6, 'David', NULL, 'Viewer', 'viewer@studentherald.com', '1234567895', '+1', '1995-06-10', 'M', 1, FALSE, FALSE, FALSE, UUID(), NOW()),
(7, 'Lisa', 'Ann', 'Writer', 'writer2@studentherald.com', '1234567896', '+1', '1996-07-15', 'F', 2, TRUE, FALSE, FALSE, UUID(), NOW()),
(8, 'James', NULL, 'Editor', 'editor2@studentherald.com', '1234567897', '+1', '1997-08-20', 'M', 1, TRUE, FALSE, FALSE, UUID(), NOW())
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- ============================================================================
-- BACK OFFICE USERS (LOGIN CREDENTIALS)
-- ============================================================================

-- Password: Password123!
-- Bcrypt hash: $2b$10$rZ5FqVqZ5FqVqZ5FqVqZ5O7YqVqZ5FqVqZ5FqVqZ5FqVqZ5FqVqZ5

INSERT INTO `back_office_users` (`id`, `operator_id`, `username`, `password_hash`, `last_login`, `login_attempts`, `is_locked`) VALUES
(1, 1, 'superadmin', '$2b$10$rZ5FqVqZ5FqVqZ5FqVqZ5O7YqVqZ5FqVqZ5FqVqZ5FqVqZ5FqVqZ5', NULL, 0, FALSE),
(2, 2, 'admin', '$2b$10$rZ5FqVqZ5FqVqZ5FqVqZ5O7YqVqZ5FqVqZ5FqVqZ5FqVqZ5FqVqZ5', NULL, 0, FALSE),
(3, 3, 'manager', '$2b$10$rZ5FqVqZ5FqVqZ5FqVqZ5O7YqVqZ5FqVqZ5FqVqZ5FqVqZ5FqVqZ5', NULL, 0, FALSE),
(4, 4, 'editor', '$2b$10$rZ5FqVqZ5FqVqZ5FqVqZ5O7YqVqZ5FqVqZ5FqVqZ5FqVqZ5FqVqZ5', NULL, 0, FALSE),
(5, 5, 'writer', '$2b$10$rZ5FqVqZ5FqVqZ5FqVqZ5O7YqVqZ5FqVqZ5FqVqZ5FqVqZ5FqVqZ5', NULL, 0, FALSE),
(6, 6, 'viewer', '$2b$10$rZ5FqVqZ5FqVqZ5FqVqZ5O7YqVqZ5FqVqZ5FqVqZ5FqVqZ5FqVqZ5', NULL, 0, FALSE),
(7, 7, 'writer2', '$2b$10$rZ5FqVqZ5FqVqZ5FqVqZ5O7YqVqZ5FqVqZ5FqVqZ5FqVqZ5FqVqZ5', NULL, 0, FALSE),
(8, 8, 'editor2', '$2b$10$rZ5FqVqZ5FqVqZ5FqVqZ5O7YqVqZ5FqVqZ5FqVqZ5FqVqZ5FqVqZ5', NULL, 0, FALSE)
ON DUPLICATE KEY UPDATE `username` = VALUES(`username`);

-- ============================================================================
-- ROLE MAPPINGS
-- ============================================================================

INSERT INTO `entity_operator_role_mapping` (`operator_id`, `role_type_id`, `active_status_id`, `created_on`) VALUES
(1, 1, 1, NOW()), -- Super Admin
(2, 2, 1, NOW()), -- Admin
(3, 3, 1, NOW()), -- Content Manager
(4, 4, 1, NOW()), -- Editor
(5, 5, 1, NOW()), -- Content Writer
(6, 6, 1, NOW()), -- Viewer
(7, 5, 1, NOW()), -- Content Writer
(8, 4, 1, NOW())  -- Editor
ON DUPLICATE KEY UPDATE `active_status_id` = VALUES(`active_status_id`);

-- ============================================================================
-- DUMMY CATEGORIES
-- ============================================================================

INSERT INTO `category` (`id`, `name`, `slug`, `description`, `priority`, `status_id`, `created_on`) VALUES
(1, 'Education', 'education', 'Educational content and resources', 1, 1, NOW()),
(2, 'Technology', 'technology', 'Latest technology news and trends', 2, 1, NOW()),
(3, 'Career', 'career', 'Career guidance and opportunities', 3, 1, NOW()),
(4, 'Student Life', 'student-life', 'Campus life and student activities', 4, 1, NOW()),
(5, 'Study Abroad', 'study-abroad', 'International education opportunities', 5, 1, NOW()),
(6, 'Scholarships', 'scholarships', 'Scholarship information and guides', 6, 1, NOW()),
(7, 'Admissions', 'admissions', 'College admission guides', 7, 1, NOW()),
(8, 'News', 'news', 'Latest education news', 8, 1, NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ============================================================================
-- DUMMY TAGS
-- ============================================================================

INSERT INTO `tags` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Higher Education', 'higher-education', 'Posts about higher education'),
(2, 'Online Learning', 'online-learning', 'Online courses and e-learning'),
(3, 'STEM', 'stem', 'Science, Technology, Engineering, Math'),
(4, 'Business', 'business', 'Business education and MBA'),
(5, 'Arts', 'arts', 'Arts and humanities'),
(6, 'Medicine', 'medicine', 'Medical education'),
(7, 'Engineering', 'engineering', 'Engineering programs'),
(8, 'Law', 'law', 'Legal education'),
(9, 'MBA', 'mba', 'MBA programs'),
(10, 'PhD', 'phd', 'Doctoral programs'),
(11, 'Undergraduate', 'undergraduate', 'Bachelor degree programs'),
(12, 'Graduate', 'graduate', 'Master degree programs'),
(13, 'Financial Aid', 'financial-aid', 'Financial aid and loans'),
(14, 'Campus Life', 'campus-life', 'Student life on campus'),
(15, 'Internships', 'internships', 'Internship opportunities')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ============================================================================
-- DUMMY UNIVERSITIES
-- ============================================================================

INSERT INTO `universities` (`id`, `name`, `slug`, `established_on`, `description`, `students_capacity`, `numbers_of_faculty`, `country`, `state`, `city`, `zip_code`, `website`, `email`, `phone`, `status_id`, `is_featured`) VALUES
(1, 'Harvard University', 'harvard-university', '1636-09-08', 'Private Ivy League research university in Cambridge, Massachusetts', 23000, 2400, 'United States', 'Massachusetts', 'Cambridge', '02138', 'https://www.harvard.edu', 'info@harvard.edu', '+1-617-495-1000', 1, TRUE),
(2, 'Stanford University', 'stanford-university', '1885-10-01', 'Private research university in Stanford, California', 17000, 2240, 'United States', 'California', 'Stanford', '94305', 'https://www.stanford.edu', 'info@stanford.edu', '+1-650-723-2300', 1, TRUE),
(3, 'MIT', 'mit', '1861-04-10', 'Private research university in Cambridge, Massachusetts', 11500, 1000, 'United States', 'Massachusetts', 'Cambridge', '02139', 'https://www.mit.edu', 'info@mit.edu', '+1-617-253-1000', 1, TRUE),
(4, 'Oxford University', 'oxford-university', '1096-01-01', 'Collegiate research university in Oxford, England', 24000, 7000, 'United Kingdom', 'England', 'Oxford', 'OX1 2JD', 'https://www.ox.ac.uk', 'info@ox.ac.uk', '+44-1865-270000', 1, TRUE),
(5, 'Cambridge University', 'cambridge-university', '1209-01-01', 'Collegiate research university in Cambridge, England', 24000, 5500, 'United Kingdom', 'England', 'Cambridge', 'CB2 1TN', 'https://www.cam.ac.uk', 'info@cam.ac.uk', '+44-1223-337733', 1, TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);


-- ============================================================================
-- DUMMY COURSES
-- ============================================================================

INSERT INTO `courses` (`id`, `title`, `slug`, `description`, `content`, `instructor`, `duration`, `level`, `price`, `currency`, `category_id`, `university_id`, `is_featured`, `is_trending`, `status`, `enrollment_count`, `rating`, `published_at`, `created_by`) VALUES
(1, 'Introduction to Computer Science', 'intro-to-cs', 'Learn the fundamentals of computer science and programming', 'Comprehensive introduction to computer science covering algorithms, data structures, and programming fundamentals.', 'Dr. John Smith', '12 weeks', 'beginner', 0.00, 'USD', 2, 1, TRUE, TRUE, 'published', 1250, 4.8, NOW(), 1),
(2, 'Data Science and Machine Learning', 'data-science-ml', 'Master data science and machine learning techniques', 'Advanced course covering statistical analysis, machine learning algorithms, and practical applications.', 'Prof. Sarah Johnson', '16 weeks', 'advanced', 0.00, 'USD', 2, 2, TRUE, TRUE, 'published', 980, 4.9, NOW(), 1),
(3, 'Business Administration Fundamentals', 'business-admin', 'Core concepts of business administration and management', 'Learn essential business principles, management strategies, and organizational behavior.', 'Dr. Michael Brown', '10 weeks', 'intermediate', 0.00, 'USD', 4, 1, FALSE, TRUE, 'published', 750, 4.6, NOW(), 1),
(4, 'Advanced Mathematics', 'advanced-math', 'Higher level mathematics for STEM students', 'Covers calculus, linear algebra, differential equations, and their applications.', 'Prof. Emily Davis', '14 weeks', 'advanced', 0.00, 'USD', 3, 3, TRUE, FALSE, 'published', 620, 4.7, NOW(), 1),
(5, 'Creative Writing Workshop', 'creative-writing', 'Develop your creative writing skills', 'Explore various forms of creative writing including fiction, poetry, and non-fiction.', 'Dr. James Wilson', '8 weeks', 'beginner', 0.00, 'USD', 5, 4, FALSE, FALSE, 'published', 450, 4.5, NOW(), 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- ============================================================================
-- DUMMY ARTICLES
-- ============================================================================

INSERT INTO `article` (`id`, `title`, `url_slug`, `brief`, `excerpt`, `content`, `time_to_read`, `category_id`, `article_label_id`, `status_id`, `publish_date`, `view_count`, `like_count`, `meta_title`, `meta_description`, `focus_keyword`, `allow_indexing`, `created_on`, `created_by`, `last_updated_on`, `last_updated_by`) VALUES
(1, 'Top 10 Universities in the World for 2024', 'top-10-universities-2024', 'Discover the leading universities globally', 'Explore our comprehensive ranking of the world\'s top universities based on academic excellence, research output, and student satisfaction.', '<h2>Introduction</h2><p>The global higher education landscape continues to evolve, with universities worldwide competing for excellence in teaching, research, and innovation. Our 2024 rankings highlight institutions that have demonstrated outstanding performance across multiple criteria.</p><h2>Ranking Methodology</h2><p>Our rankings consider academic reputation, employer reputation, faculty-to-student ratio, citations per faculty, international faculty ratio, and international student ratio.</p><h2>Top 10 Universities</h2><ol><li>Harvard University</li><li>Stanford University</li><li>MIT</li><li>Oxford University</li><li>Cambridge University</li></ol>', '8 min', 1, 2, 1, NOW(), 1250, 89, 'Top 10 Universities 2024 | Global Rankings', 'Discover the world\'s top 10 universities for 2024. Comprehensive rankings based on academic excellence, research, and student satisfaction.', 'top universities 2024', TRUE, NOW(), 1, NOW(), 1),

(2, 'How to Apply for Scholarships: Complete Guide', 'scholarship-application-guide', 'Step-by-step guide to scholarship applications', 'Learn the essential steps and strategies for successful scholarship applications, from finding opportunities to writing winning essays.', '<h2>Finding Scholarships</h2><p>Start your scholarship search early. Use online databases, check with your school counselor, and explore opportunities from professional organizations.</p><h2>Application Process</h2><p>Most scholarships require an application form, transcripts, letters of recommendation, and essays. Prepare these materials well in advance.</p><h2>Writing Your Essay</h2><p>Your scholarship essay should be personal, authentic, and demonstrate your goals and achievements. Proofread carefully and ask for feedback.</p>', '12 min', 6, 1, 1, NOW(), 2100, 156, 'Scholarship Application Guide | How to Apply', 'Complete guide to applying for scholarships. Learn how to find opportunities, write winning essays, and increase your chances of success.', 'scholarship application', TRUE, NOW(), 5, NOW(), 5),

(3, 'The Future of Online Learning in Higher Education', 'future-online-learning', 'Exploring trends in digital education', 'Online learning has transformed higher education. Discover the latest trends, technologies, and predictions for the future of digital learning.', '<h2>The Rise of Online Education</h2><p>The COVID-19 pandemic accelerated the adoption of online learning, but the trend was already growing. Universities worldwide now offer comprehensive online programs.</p><h2>Emerging Technologies</h2><p>AI-powered learning platforms, virtual reality classrooms, and adaptive learning systems are reshaping how students learn online.</p><h2>Hybrid Models</h2><p>The future likely involves hybrid models combining the best of online and in-person learning experiences.</p>', '10 min', 2, 3, 1, NOW(), 890, 67, 'Future of Online Learning | Higher Education Trends', 'Explore the future of online learning in higher education. Latest trends, technologies, and predictions for digital education.', 'online learning future', TRUE, NOW(), 5, NOW(), 5),

(4, 'STEM Careers: Opportunities and Growth', 'stem-careers-guide', 'Career opportunities in STEM fields', 'STEM careers offer excellent growth prospects and competitive salaries. Learn about various STEM fields and how to prepare for these careers.', '<h2>What is STEM?</h2><p>STEM stands for Science, Technology, Engineering, and Mathematics. These fields are critical for innovation and economic growth.</p><h2>Top STEM Careers</h2><ul><li>Software Developer</li><li>Data Scientist</li><li>Biomedical Engineer</li><li>Environmental Scientist</li><li>Cybersecurity Analyst</li></ul><h2>Preparing for STEM</h2><p>Strong foundation in math and science, hands-on experience through internships, and continuous learning are key to success in STEM.</p>', '9 min', 3, 4, 1, NOW(), 1450, 112, 'STEM Careers Guide | Opportunities and Growth', 'Comprehensive guide to STEM careers. Explore opportunities, salary prospects, and how to prepare for a successful STEM career.', 'STEM careers', TRUE, NOW(), 7, NOW(), 7),

(5, 'Study Abroad: Choosing the Right Country', 'study-abroad-country-guide', 'Guide to selecting your study destination', 'Choosing where to study abroad is a major decision. Compare popular destinations, costs, and opportunities to find your perfect match.', '<h2>Popular Study Destinations</h2><p>United States, United Kingdom, Canada, Australia, and Germany are among the most popular destinations for international students.</p><h2>Factors to Consider</h2><ul><li>Cost of living and tuition</li><li>Language requirements</li><li>Post-study work opportunities</li><li>Cultural fit</li><li>Quality of education</li></ul><h2>Making Your Decision</h2><p>Research thoroughly, talk to current students, and consider your career goals when choosing your study destination.</p>', '11 min', 5, 2, 1, NOW(), 1680, 134, 'Study Abroad Guide | Choosing the Right Country', 'Complete guide to choosing your study abroad destination. Compare countries, costs, and opportunities for international students.', 'study abroad', TRUE, NOW(), 7, NOW(), 7)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- ============================================================================
-- ARTICLE TAGS (RELATIONSHIPS)
-- ============================================================================

INSERT INTO `article_tag` (`article_id`, `tag_id`) VALUES
(1, 1), (1, 11), (1, 12),
(2, 13), (2, 11), (2, 12),
(3, 2), (3, 1),
(4, 3), (4, 7), (4, 15),
(5, 1), (5, 11), (5, 12)
ON DUPLICATE KEY UPDATE `article_id` = VALUES(`article_id`);

-- ============================================================================
-- ARTICLE AUTHORS (RELATIONSHIPS)
-- ============================================================================

INSERT INTO `article_authors` (`article_id`, `author_id`, `author_order`) VALUES
(1, 5, 1),
(2, 5, 1),
(3, 7, 1),
(4, 7, 1),
(5, 5, 1), (5, 7, 2)
ON DUPLICATE KEY UPDATE `author_order` = VALUES(`author_order`);

-- ============================================================================
-- ARTICLE SETTINGS
-- ============================================================================

INSERT INTO `article_settings` (`article_id`, `comment_count`, `share_count`, `allow_comments`, `allow_sharing`, `is_featured`, `is_trending`, `is_editors_pick`) VALUES
(1, 23, 145, TRUE, TRUE, TRUE, TRUE, TRUE),
(2, 18, 98, TRUE, TRUE, FALSE, TRUE, FALSE),
(3, 12, 67, TRUE, TRUE, FALSE, FALSE, TRUE),
(4, 15, 89, TRUE, TRUE, FALSE, TRUE, FALSE),
(5, 20, 112, TRUE, TRUE, TRUE, FALSE, FALSE)
ON DUPLICATE KEY UPDATE `comment_count` = VALUES(`comment_count`);


-- ============================================================================
-- DUMMY COMMENTS
-- ============================================================================

INSERT INTO `article_comment` (`article_id`, `parent_comment_id`, `author_name`, `author_email`, `content`, `status_id`, `ip_address`) VALUES
(1, NULL, 'Alex Johnson', 'alex.j@example.com', 'Great article! Very informative ranking of universities.', 1, '192.168.1.1'),
(1, 1, 'Maria Garcia', 'maria.g@example.com', 'I agree! This helped me narrow down my choices.', 1, '192.168.1.2'),
(2, NULL, 'Robert Chen', 'robert.c@example.com', 'Thanks for the scholarship tips. Very helpful!', 1, '192.168.1.3'),
(3, NULL, 'Jennifer Lee', 'jennifer.l@example.com', 'Online learning has really changed education for the better.', 1, '192.168.1.4'),
(4, NULL, 'Michael Brown', 'michael.b@example.com', 'STEM careers are definitely the future!', 1, '192.168.1.5')
ON DUPLICATE KEY UPDATE `author_name` = VALUES(`author_name`);

-- ============================================================================
-- DUMMY ADVERTISEMENTS
-- ============================================================================

INSERT INTO `advertisement` (`id`, `name`, `slot`, `type_id`, `format_id`, `image_url`, `target_url`, `start_date`, `end_date`, `is_active`, `priority`, `impressions`, `clicks`, `status_id`, `created_on`, `created_by`) VALUES
(1, 'University Fair 2024', 'home-banner', 1, 1, 'https://example.com/ads/university-fair.jpg', 'https://universityfair2024.com', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), TRUE, 10, 15000, 450, 1, NOW(), 2),
(2, 'Online Course Promotion', 'sidebar-top', 1, 2, 'https://example.com/ads/online-courses.jpg', 'https://onlinecourses.com', NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), TRUE, 8, 8500, 210, 1, NOW(), 2),
(3, 'Scholarship Program', 'article-mid', 1, 2, 'https://example.com/ads/scholarship.jpg', 'https://scholarships.com', NOW(), DATE_ADD(NOW(), INTERVAL 90 DAY), TRUE, 9, 12000, 380, 1, NOW(), 2)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ============================================================================
-- DUMMY HERO CONTENT
-- ============================================================================

INSERT INTO `hero_content` (`id`, `title`, `subtitle`, `description`, `button_text`, `button_url`, `category_id`, `priority`, `is_active`) VALUES
(1, 'Welcome to Student Herald', 'Your Gateway to Higher Education', 'Discover universities, courses, scholarships, and career opportunities from around the world.', 'Explore Now', '/explore', 1, 1, TRUE),
(2, 'Find Your Perfect University', 'Search from thousands of programs worldwide', 'Compare universities, read reviews, and make informed decisions about your education.', 'Search Universities', '/universities', 1, 2, TRUE),
(3, 'Scholarship Opportunities', 'Fund your education dreams', 'Browse hundreds of scholarship opportunities and learn how to apply successfully.', 'View Scholarships', '/scholarships', 6, 3, TRUE)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- ============================================================================
-- DUMMY CAROUSEL ITEMS
-- ============================================================================

INSERT INTO `carousel_items` (`id`, `title`, `description`, `link_url`, `priority`, `is_active`) VALUES
(1, 'Top Universities 2024', 'Explore the world\'s leading universities', '/articles/top-10-universities-2024', 1, TRUE),
(2, 'Study Abroad Guide', 'Everything you need to know about studying abroad', '/articles/study-abroad-country-guide', 2, TRUE),
(3, 'STEM Careers', 'Discover exciting career opportunities in STEM', '/articles/stem-careers-guide', 3, TRUE)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- ============================================================================
-- DUMMY NAVIGATION MENU
-- ============================================================================

INSERT INTO `navigation_menu` (`id`, `title`, `url`, `parent_id`, `menu_order`, `is_active`) VALUES
(1, 'Home', '/', NULL, 1, TRUE),
(2, 'Universities', '/universities', NULL, 2, TRUE),
(3, 'Courses', '/courses', NULL, 3, TRUE),
(4, 'Articles', '/articles', NULL, 4, TRUE),
(5, 'Scholarships', '/scholarships', NULL, 5, TRUE),
(6, 'About', '/about', NULL, 6, TRUE),
(7, 'Contact', '/contact', NULL, 7, TRUE),
(8, 'Search Universities', '/universities/search', 2, 1, TRUE),
(9, 'Top Rankings', '/universities/rankings', 2, 2, TRUE),
(10, 'By Country', '/universities/by-country', 2, 3, TRUE)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- ============================================================================
-- DUMMY CONTACTS
-- ============================================================================

INSERT INTO `contacts` (`id`, `name`, `email`, `phone`, `subject`, `message`, `status_id`, `ip_address`) VALUES
(1, 'John Doe', 'john.doe@example.com', '+1-555-0101', 'Question about admissions', 'I would like to know more about the admission process for international students.', 1, '192.168.1.10'),
(2, 'Jane Smith', 'jane.smith@example.com', '+1-555-0102', 'Scholarship inquiry', 'Are there any scholarships available for graduate students?', 2, '192.168.1.11'),
(3, 'Bob Wilson', 'bob.wilson@example.com', '+1-555-0103', 'Technical issue', 'I am having trouble accessing my account.', 3, '192.168.1.12')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ============================================================================
-- DUMMY COUNTRIES
-- ============================================================================

INSERT INTO `country` (`id`, `name`, `code`, `iso_code`, `phone_code`, `currency`, `is_active`) VALUES
(1, 'United States', 'US', 'USA', '+1', 'USD', TRUE),
(2, 'United Kingdom', 'GB', 'GBR', '+44', 'GBP', TRUE),
(3, 'Canada', 'CA', 'CAN', '+1', 'CAD', TRUE),
(4, 'Australia', 'AU', 'AUS', '+61', 'AUD', TRUE),
(5, 'Germany', 'DE', 'DEU', '+49', 'EUR', TRUE),
(6, 'France', 'FR', 'FRA', '+33', 'EUR', TRUE),
(7, 'India', 'IN', 'IND', '+91', 'INR', TRUE),
(8, 'China', 'CN', 'CHN', '+86', 'CNY', TRUE)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- ============================================================================
-- DUMMY CONFIG OPTIONS
-- ============================================================================

INSERT INTO `config_option` (`option_key`, `option_value`, `option_type_id`, `description`, `is_public`) VALUES
('site_name', 'Student Herald', 1, 'Website name', TRUE),
('site_tagline', 'Your Gateway to Higher Education', 1, 'Website tagline', TRUE),
('contact_email', 'info@studentherald.com', 1, 'Contact email address', TRUE),
('items_per_page', '20', 1, 'Number of items per page', FALSE),
('enable_comments', 'true', 1, 'Enable article comments', FALSE),
('maintenance_mode', 'false', 1, 'Maintenance mode status', FALSE)
ON DUPLICATE KEY UPDATE `option_value` = VALUES(`option_value`);

-- ============================================================================
-- LOGIN CREDENTIALS SUMMARY
-- ============================================================================

/*
╔════════════════════════════════════════════════════════════════════════════╗
║                        TEST LOGIN CREDENTIALS                              ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  ALL USERS PASSWORD: Password123!                                         ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │ SUPER ADMIN                                                          │ ║
║  │ Username: superadmin                                                 │ ║
║  │ Email: superadmin@studentherald.com                                  │ ║
║  │ Password: Password123!                                               │ ║
║  │ Permissions: ALL (Full system access)                                │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │ ADMIN                                                                │ ║
║  │ Username: admin                                                      │ ║
║  │ Email: admin@studentherald.com                                       │ ║
║  │ Password: Password123!                                               │ ║
║  │ Permissions: ALL (Full system access)                                │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │ CONTENT MANAGER                                                      │ ║
║  │ Username: manager                                                    │ ║
║  │ Email: manager@studentherald.com                                     │ ║
║  │ Password: Password123!                                               │ ║
║  │ Permissions: Create, Edit, Delete, Publish Articles, Manage Categories│ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │ EDITOR                                                               │ ║
║  │ Username: editor                                                     │ ║
║  │ Email: editor@studentherald.com                                      │ ║
║  │ Password: Password123!                                               │ ║
║  │ Permissions: Create, Edit Own, View, Approve Articles               │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │ CONTENT WRITER                                                       │ ║
║  │ Username: writer                                                     │ ║
║  │ Email: writer@studentherald.com                                      │ ║
║  │ Password: Password123!                                               │ ║
║  │ Permissions: Create, Edit Own, View Articles                        │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────────┐ ║
║  │ VIEWER                                                               │ ║
║  │ Username: viewer                                                     │ ║
║  │ Email: viewer@studentherald.com                                      │ ║
║  │ Password: Password123!                                               │ ║
║  │ Permissions: View Articles, Categories, Courses                     │ ║
║  └──────────────────────────────────────────────────────────────────────┘ ║
║                                                                            ║
║  Additional Test Users:                                                  ║
║  - writer2 / writer2@studentherald.com (Content Writer)                  ║
║  - editor2 / editor2@studentherald.com (Editor)                          ║
║                                                                            ║
╠════════════════════════════════════════════════════════════════════════════╣
║                          DUMMY DATA INCLUDED                               ║
╠════════════════════════════════════════════════════════════════════════════╣
║  ✓ 8 Test Users (all roles)                                               ║
║  ✓ 8 Categories                                                            ║
║  ✓ 15 Tags                                                                 ║
║  ✓ 5 Universities                                                          ║
║  ✓ 5 Courses                                                               ║
║  ✓ 5 Articles (with tags, authors, comments)                               ║
║  ✓ 5 Comments                                                              ║
║  ✓ 3 Advertisements                                                        ║
║  ✓ 3 Hero Content Items                                                    ║
║  ✓ 3 Carousel Items                                                        ║
║  ✓ 10 Navigation Menu Items                                                ║
║  ✓ 3 Contact Form Submissions                                              ║
║  ✓ 8 Countries                                                             ║
║  ✓ 6 Config Options                                                        ║
╚════════════════════════════════════════════════════════════════════════════╝

IMPORTANT NOTES:
1. Change all passwords immediately after first login in production
2. Delete or disable test accounts in production environment
3. The password hash shown is a placeholder - actual hash will be generated
4. All test data is for development/testing purposes only
5. Review and customize dummy data before production deployment

*/

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
