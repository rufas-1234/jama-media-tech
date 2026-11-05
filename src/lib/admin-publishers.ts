import 'server-only';

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { RowDataPacket } from 'mysql2/promise';
import { getTiDBPool } from '@/lib/tidb';

const scrypt = promisify(scryptCallback);

export type Publisher = {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'disabled';
  createdAt: string;
};

type PublisherRow = RowDataPacket & {
  id: number | string | bigint;
  name: string;
  email: string;
  password_hash: string;
  status: 'active' | 'disabled';
  created_at: Date | string;
};

function toPublisher(row: PublisherRow): Publisher {
  const id = Number(row.id);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('TiDB returned an invalid publisher ID.');
  const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : new Date(row.created_at).toISOString();
  if (Number.isNaN(Date.parse(createdAt))) throw new Error('TiDB returned an invalid publisher creation date.');
  return { id, name: row.name, email: row.email, status: row.status, createdAt };
}

export async function listPublishers(): Promise<Publisher[]> {
  const [rows] = await getTiDBPool().execute<PublisherRow[]>(
    'SELECT id, name, email, password_hash, status, created_at FROM admin_publishers ORDER BY created_at DESC, id DESC',
  );
  return rows.map(toPublisher);
}

export async function getPublisherByEmail(email: string): Promise<(Publisher & { passwordHash: string }) | undefined> {
  const [rows] = await getTiDBPool().execute<PublisherRow[]>(
    'SELECT id, name, email, password_hash, status, created_at FROM admin_publishers WHERE email = ? LIMIT 1',
    [email.trim().toLowerCase()],
  );
  if (!rows[0]) return undefined;
  return { ...toPublisher(rows[0]), passwordHash: rows[0].password_hash };
}

export async function createPublisher(name: string, email: string, password: string): Promise<Publisher> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64) as Buffer;
  const passwordHash = `scrypt$${salt.toString('hex')}$${derived.toString('hex')}`;
  const normalizedEmail = email.trim().toLowerCase();
  const [result] = await getTiDBPool().execute(
    'INSERT INTO admin_publishers (name, email, password_hash) VALUES (?, ?, ?)',
    [name.trim(), normalizedEmail, passwordHash],
  );
  const insertId = Number((result as { insertId: number | bigint }).insertId);
  if (!Number.isSafeInteger(insertId) || insertId < 1) throw new Error('TiDB did not return a valid publisher ID.');
  const publisher = await getPublisherByEmail(normalizedEmail);
  if (!publisher || publisher.id !== insertId) throw new Error('TiDB could not verify the newly created publisher.');
  return {
    id: publisher.id,
    name: publisher.name,
    email: publisher.email,
    status: publisher.status,
    createdAt: publisher.createdAt,
  };
}

export async function verifyPublisherPassword(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, saltHex, hashHex, extra] = encodedHash.split('$');
  if (algorithm !== 'scrypt' || !saltHex || !hashHex || extra || !/^[a-f0-9]{32}$/i.test(saltHex) || !/^[a-f0-9]{128}$/i.test(hashHex)) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length) as Buffer;
  return timingSafeEqual(actual, expected);
}

export async function deletePublisher(id: number): Promise<boolean> {
  const [result] = await getTiDBPool().execute(
    'DELETE FROM admin_publishers WHERE id = ?',
    [id],
  );
  return (result as { affectedRows: number }).affectedRows > 0;
}
