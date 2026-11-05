import 'server-only';

import { createPool, type Pool } from 'mysql2/promise';

const requiredEnvironment = ['TIDB_HOST', 'TIDB_USER', 'TIDB_PASSWORD', 'TIDB_DATABASE'] as const;
const globalForTiDB = globalThis as typeof globalThis & { tidbPool?: Pool };

export function tidbHasConfiguration() {
  return requiredEnvironment.some((name) => Boolean(process.env[name]));
}

export function tidbIsConfigured() {
  return requiredEnvironment.every((name) => Boolean(process.env[name]));
}

export function getTiDBPool(): Pool {
  if (!tidbIsConfigured()) {
    const missing = requiredEnvironment.filter((name) => !process.env[name]);
    throw new Error(`TiDB is not configured. Missing: ${missing.join(', ')}.`);
  }
  if (globalForTiDB.tidbPool) return globalForTiDB.tidbPool;

  const port = Number(process.env.TIDB_PORT || 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('TIDB_PORT must be a valid TCP port.');
  }

  const ca = process.env.TIDB_CA_CERT?.replace(/\\n/g, '\n').trim();
  const pool = createPool({
    host: process.env.TIDB_HOST,
    port,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    ssl: { rejectUnauthorized: true, ...(ca ? { ca } : {}) },
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 2,
    idleTimeout: 60_000,
    queueLimit: 0,
    timezone: 'Z',
  });
  globalForTiDB.tidbPool = pool;
  return pool;
}
