CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(64) NOT NULL PRIMARY KEY,
  content JSON NOT NULL,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS posts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  content_type ENUM('news', 'project') NOT NULL,
  title VARCHAR(240) NOT NULL,
  slug VARCHAR(180) NOT NULL,
  excerpt TEXT NOT NULL,
  content MEDIUMTEXT NOT NULL,
  status ENUM('draft', 'publish') NOT NULL DEFAULT 'draft',
  category VARCHAR(180) NOT NULL DEFAULT '',
  location VARCHAR(180) NOT NULL DEFAULT '',
  image_url VARCHAR(2048) NOT NULL DEFAULT '',
  gallery_images JSON NULL,
  `date` DATETIME(3) NULL,
  modified DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY posts_content_type_slug (content_type, slug),
  KEY posts_public_listing (content_type, status, `date`)
);

CREATE TABLE IF NOT EXISTS admin_publishers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE KEY admin_publishers_email (email)
);

CREATE TABLE IF NOT EXISTS business_requests (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  request_type ENUM('enquiry', 'quotation') NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  organization VARCHAR(160) NOT NULL DEFAULT '',
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(60) NOT NULL DEFAULT '',
  country VARCHAR(120) NOT NULL DEFAULT '',
  subject VARCHAR(180) NOT NULL,
  category VARCHAR(120) NOT NULL,
  requirements TEXT NOT NULL,
  scope VARCHAR(500) NOT NULL DEFAULT '',
  delivery_location VARCHAR(160) NOT NULL DEFAULT '',
  status ENUM('new', 'reviewing', 'quoted', 'closed') NOT NULL DEFAULT 'new',
  internal_notes TEXT NOT NULL,
  response_message TEXT NOT NULL,
  quote_amount DECIMAL(15, 2) NULL,
  quote_currency CHAR(3) NOT NULL DEFAULT '',
  consented_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  submitted_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
    ON UPDATE CURRENT_TIMESTAMP(3),
  KEY business_requests_queue (status, submitted_at),
  KEY business_requests_type (request_type, submitted_at)
);
