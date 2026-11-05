ALTER TABLE posts
  ADD COLUMN gallery_images JSON NULL AFTER image_url;

UPDATE posts
SET gallery_images = JSON_ARRAY(image_url)
WHERE image_url <> '';
