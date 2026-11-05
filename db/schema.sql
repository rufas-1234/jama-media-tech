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
