ALTER TABLE admin_publishers
  ADD COLUMN role ENUM('admin', 'publisher') NOT NULL DEFAULT 'publisher'
  AFTER password_hash;
