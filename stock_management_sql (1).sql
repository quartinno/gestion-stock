-- Create database if not exists
CREATE DATABASE IF NOT EXISTS `stock_management`;
USE `stock_management`;

-- Set foreign key checks to 0 to avoid constraint issues during table creation
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================
-- 1. BUSINESS MANAGEMENT LAYER
-- =============================================

-- Business table (Main entity)
CREATE TABLE `business` (
    `business_id` CHAR(36) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `phone` VARCHAR(50),
    `address` TEXT,
    `registration_date` DATETIME NOT NULL,
    `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX `idx_business_email` (`email`),
    INDEX `idx_business_status` (`status`)
);

-- Plan table (Subscription plans)
CREATE TABLE `plan` (
    `plan_id` CHAR(36) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10,2) NOT NULL,
    `duration` INT NOT NULL COMMENT 'Duration in months',
    `max_users` INT NOT NULL,
    `max_products` INT NOT NULL,
    `features` JSON,
    `status` ENUM('active', 'inactive') DEFAULT 'active',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX `idx_plan_status` (`status`)
);

-- Subscription table
CREATE TABLE `subscription` (
    `subscription_id` CHAR(36) PRIMARY KEY,
    `business_id` CHAR(36) NOT NULL,
    `plan_id` CHAR(36) NOT NULL,
    `start_date` DATETIME NOT NULL,
    `end_date` DATETIME NOT NULL,
    `status` ENUM('active', 'expired', 'pending', 'cancelled') DEFAULT 'pending',
    `auto_renewal` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`) ON DELETE CASCADE,
    FOREIGN KEY (`plan_id`) REFERENCES `plan`(`plan_id`) ON DELETE RESTRICT,
    
    INDEX `idx_subscription_business` (`business_id`),
    INDEX `idx_subscription_plan` (`plan_id`),
    INDEX `idx_subscription_status` (`status`)
);

-- Payment table
CREATE TABLE `payment` (
    `payment_id` CHAR(36) PRIMARY KEY,
    `subscription_id` CHAR(36) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `transaction_id` VARCHAR(255),
    `payment_method` VARCHAR(100) NOT NULL,
    `payment_date` DATETIME NOT NULL,
    `status` ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    `stripe_payment_intent_id` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`subscription_id`) REFERENCES `subscription`(`subscription_id`) ON DELETE CASCADE,
    
    INDEX `idx_payment_subscription` (`subscription_id`),
    INDEX `idx_payment_status` (`status`),
    INDEX `idx_payment_date` (`payment_date`)
);

-- =============================================
-- 2. USER MANAGEMENT LAYER
-- =============================================

-- User table
CREATE TABLE `user` (
    `user_id` CHAR(36) PRIMARY KEY,
    `business_id` CHAR(36) NOT NULL,
    `username` VARCHAR(255) NOT NULL UNIQUE,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(50),
    `role` ENUM('super_admin', 'business_admin', 'inventory_manager', 'cashier') NOT NULL,
    `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    `last_login` DATETIME,
    `email_verified_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`) ON DELETE CASCADE,
    
    INDEX `idx_user_business` (`business_id`),
    INDEX `idx_user_username` (`username`),
    INDEX `idx_user_email` (`email`),
    INDEX `idx_user_role` (`role`),
    INDEX `idx_user_status` (`status`)
);

-- User Session table
CREATE TABLE `user_session` (
    `session_id` CHAR(36) PRIMARY KEY,
    `user_id` CHAR(36) NOT NULL,
    `token` VARCHAR(500) NOT NULL,
    `expires_at` DATETIME NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE,
    
    INDEX `idx_session_user` (`user_id`),
    INDEX `idx_session_token` (`token`),
    INDEX `idx_session_expires` (`expires_at`)
);

-- =============================================
-- 3. PRODUCT MANAGEMENT LAYER
-- =============================================

-- Category table (with self-reference for subcategories)
CREATE TABLE `category` (
    `category_id` CHAR(36) PRIMARY KEY,
    `business_id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `parent_id` CHAR(36) NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`) ON DELETE CASCADE,
    FOREIGN KEY (`parent_id`) REFERENCES `category`(`category_id`) ON DELETE SET NULL,
    
    INDEX `idx_category_business` (`business_id`),
    INDEX `idx_category_parent` (`parent_id`),
    INDEX `idx_category_name` (`name`)
);

-- Supplier table
CREATE TABLE `supplier` (
    `supplier_id` CHAR(36) PRIMARY KEY,
    `business_id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `contact_person` VARCHAR(255),
    `email` VARCHAR(255),
    `phone` VARCHAR(50),
    `address` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`) ON DELETE CASCADE,
    
    INDEX `idx_supplier_business` (`business_id`),
    INDEX `idx_supplier_name` (`name`)
);

-- Product table
CREATE TABLE `product` (
    `product_id` CHAR(36) PRIMARY KEY,
    `business_id` CHAR(36) NOT NULL,
    `category_id` CHAR(36) NOT NULL,
    `supplier_id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `barcode` VARCHAR(255) NOT NULL,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `cost_price` DECIMAL(10,2) NOT NULL,
    `description` TEXT,
    `expiration_date` DATE,
    `quantity_in_stock` INT DEFAULT 0,
    `minimum_stock_threshold` INT DEFAULT 0,
    `tax_rate` DECIMAL(5,2) DEFAULT 0.00,
    `status` ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`supplier_id`) ON DELETE RESTRICT,
    
    UNIQUE KEY `unique_barcode_per_business` (`business_id`, `barcode`),
    INDEX `idx_product_business` (`business_id`),
    INDEX `idx_product_category` (`category_id`),
    INDEX `idx_product_supplier` (`supplier_id`),
    INDEX `idx_product_barcode` (`barcode`),
    INDEX `idx_product_status` (`status`)
);

-- Stock Movement table
CREATE TABLE `stock_movement` (
    `movement_id` CHAR(36) PRIMARY KEY,
    `product_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `movement_type` ENUM('stock_in', 'stock_out', 'adjustment', 'damaged', 'expired') NOT NULL,
    `quantity` INT NOT NULL,
    `reference_id` CHAR(36) NULL COMMENT 'References sale_id or invoice_id',
    `notes` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT,
    
    INDEX `idx_stock_movement_product` (`product_id`),
    INDEX `idx_stock_movement_user` (`user_id`),
    INDEX `idx_stock_movement_type` (`movement_type`),
    INDEX `idx_stock_movement_date` (`created_at`)
);

-- =============================================
-- 4. CLIENT MANAGEMENT LAYER
-- =============================================

-- Client table
CREATE TABLE `client` (
    `client_id` CHAR(36) PRIMARY KEY,
    `business_id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50),
    `email` VARCHAR(255),
    `address` TEXT,
    `credit_limit` DECIMAL(10,2) DEFAULT 0.00,
    `credit_balance` DECIMAL(10,2) DEFAULT 0.00,
    `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`) ON DELETE CASCADE,
    
    INDEX `idx_client_business` (`business_id`),
    INDEX `idx_client_name` (`name`),
    INDEX `idx_client_phone` (`phone`),
    INDEX `idx_client_status` (`status`)
);

-- Credit Transaction table
CREATE TABLE `credit_transaction` (
    `transaction_id` CHAR(36) PRIMARY KEY,
    `client_id` CHAR(36) NOT NULL,
    `transaction_type` ENUM('credit_sale', 'payment', 'adjustment') NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `reference_id` CHAR(36) NULL COMMENT 'References sale_id or invoice_id',
    `notes` TEXT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`client_id`) REFERENCES `client`(`client_id`) ON DELETE CASCADE,
    
    INDEX `idx_credit_transaction_client` (`client_id`),
    INDEX `idx_credit_transaction_type` (`transaction_type`),
    INDEX `idx_credit_transaction_date` (`created_at`)
);

-- =============================================
-- 5. SALES AND INVOICING LAYER
-- =============================================

-- Sale table
CREATE TABLE `sale` (
    `sale_id` CHAR(36) PRIMARY KEY,
    `business_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NULL,
    `user_id` CHAR(36) NOT NULL,
    `sale_date` DATETIME NOT NULL,
    `subtotal` DECIMAL(10,2) NOT NULL,
    `tax_amount` DECIMAL(10,2) DEFAULT 0.00,
    `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `payment_method` ENUM('cash', 'credit', 'card', 'mobile_money') NOT NULL,
    `status` ENUM('completed', 'cancelled', 'refunded') DEFAULT 'completed',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`) ON DELETE CASCADE,
    FOREIGN KEY (`client_id`) REFERENCES `client`(`client_id`) ON DELETE SET NULL,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT,
    
    INDEX `idx_sale_business` (`business_id`),
    INDEX `idx_sale_client` (`client_id`),
    INDEX `idx_sale_user` (`user_id`),
    INDEX `idx_sale_date` (`sale_date`),
    INDEX `idx_sale_status` (`status`)
);

-- Sale Item table
CREATE TABLE `sale_item` (
    `sale_item_id` CHAR(36) PRIMARY KEY,
    `sale_id` CHAR(36) NOT NULL,
    `product_id` CHAR(36) NOT NULL,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `total_price` DECIMAL(10,2) NOT NULL,
    `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`sale_id`) REFERENCES `sale`(`sale_id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE RESTRICT,
    
    INDEX `idx_sale_item_sale` (`sale_id`),
    INDEX `idx_sale_item_product` (`product_id`)
);

-- Invoice table
CREATE TABLE `invoice` (
    `invoice_id` CHAR(36) PRIMARY KEY,
    `business_id` CHAR(36) NOT NULL,
    `client_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `invoice_number` VARCHAR(100) NOT NULL,
    `invoice_date` DATETIME NOT NULL,
    `due_date` DATETIME NOT NULL,
    `subtotal` DECIMAL(10,2) NOT NULL,
    `tax_amount` DECIMAL(10,2) DEFAULT 0.00,
    `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
    `total_amount` DECIMAL(10,2) NOT NULL,
    `payment_status` ENUM('pending', 'partial', 'paid', 'overdue') DEFAULT 'pending',
    `status` ENUM('draft', 'sent', 'paid', 'cancelled') DEFAULT 'draft',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`) ON DELETE CASCADE,
    FOREIGN KEY (`client_id`) REFERENCES `client`(`client_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT,
    
    UNIQUE KEY `unique_invoice_number_per_business` (`business_id`, `invoice_number`),
    INDEX `idx_invoice_business` (`business_id`),
    INDEX `idx_invoice_client` (`client_id`),
    INDEX `idx_invoice_user` (`user_id`),
    INDEX `idx_invoice_date` (`invoice_date`),
    INDEX `idx_invoice_due_date` (`due_date`),
    INDEX `idx_invoice_payment_status` (`payment_status`),
    INDEX `idx_invoice_status` (`status`)
);

-- Invoice Item table
CREATE TABLE `invoice_item` (
    `invoice_item_id` CHAR(36) PRIMARY KEY,
    `invoice_id` CHAR(36) NOT NULL,
    `product_id` CHAR(36) NOT NULL,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(10,2) NOT NULL,
    `total_price` DECIMAL(10,2) NOT NULL,
    `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`invoice_id`) REFERENCES `invoice`(`invoice_id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE RESTRICT,
    
    INDEX `idx_invoice_item_invoice` (`invoice_id`),
    INDEX `idx_invoice_item_product` (`product_id`)
);

-- Invoice Payment table
CREATE TABLE `invoice_payment` (
    `payment_id` CHAR(36) PRIMARY KEY,
    `invoice_id` CHAR(36) NOT NULL,
    `amount` DECIMAL(10,2) NOT NULL,
    `payment_method` ENUM('cash', 'credit', 'card', 'mobile_money') NOT NULL,
    `payment_date` DATETIME NOT NULL,
    `reference` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`invoice_id`) REFERENCES `invoice`(`invoice_id`) ON DELETE CASCADE,
    
    INDEX `idx_invoice_payment_invoice` (`invoice_id`),
    INDEX `idx_invoice_payment_date` (`payment_date`)
);

-- =============================================
-- 6. NOTIFICATION AND ALERT LAYER
-- =============================================

-- Notification table
CREATE TABLE `notification` (
    `notification_id` CHAR(36) PRIMARY KEY,
    `business_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NULL,
    `type` ENUM('low_stock', 'expiration', 'overdue_payment', 'subscription_expiry') NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `reference_id` CHAR(36) NULL COMMENT 'References related entity',
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `read_at` DATETIME NULL,
    
    FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE,
    
    INDEX `idx_notification_business` (`business_id`),
    INDEX `idx_notification_user` (`user_id`),
    INDEX `idx_notification_type` (`type`),
    INDEX `idx_notification_read` (`is_read`),
    INDEX `idx_notification_created` (`created_at`)
);

-- Alert Rule table
CREATE TABLE `alert_rule` (
    `rule_id` CHAR(36) PRIMARY KEY,
    `business_id` CHAR(36) NOT NULL,
    `type` ENUM('low_stock', 'expiration', 'overdue_payment') NOT NULL,
    `threshold_value` INT NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (`business_id`) REFERENCES `business`(`business_id`) ON DELETE CASCADE,
    
    INDEX `idx_alert_rule_business` (`business_id`),
    INDEX `idx_alert_rule_type` (`type`),
    INDEX `idx_alert_rule_active` (`is_active`)
);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- SAMPLE DATA INSERTION (Optional)
-- =============================================

-- Insert sample plan
INSERT INTO `plan` (`plan_id`, `name`, `description`, `price`, `duration`, `max_users`, `max_products`, `status`) VALUES
(UUID(), 'Basic Plan', 'Basic features for small businesses', 29.99, 1, 5, 100, 'active'),
(UUID(), 'Pro Plan', 'Advanced features for growing businesses', 59.99, 1, 15, 500, 'active'),
(UUID(), 'Enterprise Plan', 'Full features for large businesses', 99.99, 1, 50, 1000, 'active');

-- You can add more sample data as needed...