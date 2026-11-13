import assert from 'node:assert/strict';
import test from 'node:test';
import { heroImageSource, imageSource } from '../src/lib/content.ts';

test('replaces legacy stock photo IDs and URLs', () => {
  assert.equal(
    imageSource('photo-1586528116311-ad8dd3c8310d', 900),
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=85',
  );
  assert.equal(
    imageSource('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80'),
    'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=900&q=80',
  );
});

test('preserves uploaded image URLs', () => {
  assert.equal(imageSource('/uploads/team.jpg'), '/uploads/team.jpg');
  assert.equal(imageSource('https://jama.blob.vercel-storage.com/team.jpg'), 'https://jama.blob.vercel-storage.com/team.jpg');
});

test('uses the replacement image and hero dimensions for stock hero photos', () => {
  const image = heroImageSource('photo-1593113630400-ea4288922497');
  assert.match(image, /^https:\/\/images\.unsplash\.com\/photo-1469571486292-0ba58a3f068b\?/);
  assert.match(image, /w=2560/);
  assert.match(image, /q=95/);
});
