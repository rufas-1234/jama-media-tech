import 'server-only';

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import type { BusinessRequestDraft, BusinessRequestUpdate } from '@/lib/business-request-validation';
import { getTiDBPool, tidbHasConfiguration, tidbIsConfigured } from '@/lib/tidb';

export type BusinessRequest = Omit<BusinessRequestDraft, 'consent' | 'website'> & {
  id: number;
  status: BusinessRequestUpdate['status'];
  internalNotes: string;
  responseMessage: string;
  quoteAmount: number | null;
  quoteCurrency: string;
  consentedAt: string;
  submittedAt: string;
  updatedAt: string;
};

type RequestRow = RowDataPacket & {
  id: number | string | bigint;
  request_type: BusinessRequest['type'];
  full_name: string;
  organization: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  category: string;
  requirements: string;
  scope: string;
  delivery_location: string;
  status: BusinessRequest['status'];
  internal_notes: string;
  response_message: string;
  quote_amount: number | string | null;
  quote_currency: string;
  consented_at: Date | string;
  submitted_at: Date | string;
  updated_at: Date | string;
};

type LocalRequest = BusinessRequest;
const storePath = join(process.cwd(), 'data', 'business-requests.json');

export function isBusinessRequestsTableMissing(error: unknown) {
  return typeof error === 'object' && error !== null && 'code' in error &&
    (error.code === 'ER_NO_SUCH_TABLE' || error.code === '1146');
}

export function requestStorageMode(): 'tidb' | 'local' | 'unavailable' {
  if (tidbIsConfigured()) return 'tidb';
  if (tidbHasConfiguration()) return 'unavailable';
  return process.env.NODE_ENV === 'development' ? 'local' : 'unavailable';
}

function dateToIso(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('Request storage returned an invalid date.');
  return date.toISOString();
}

function toBusinessRequest(row: RequestRow): BusinessRequest {
  const id = Number(row.id);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error('Request storage returned an invalid request ID.');
  const quoteAmount = row.quote_amount === null ? null : Number(row.quote_amount);
  if (quoteAmount !== null && !Number.isFinite(quoteAmount)) throw new Error(`Request ${id} has an invalid quote amount.`);
  return {
    id,
    type: row.request_type,
    fullName: row.full_name,
    organization: row.organization,
    email: row.email,
    phone: row.phone,
    country: row.country,
    subject: row.subject,
    category: row.category,
    requirements: row.requirements,
    scope: row.scope,
    deliveryLocation: row.delivery_location,
    status: row.status,
    internalNotes: row.internal_notes,
    responseMessage: row.response_message,
    quoteAmount,
    quoteCurrency: row.quote_currency,
    consentedAt: dateToIso(row.consented_at),
    submittedAt: dateToIso(row.submitted_at),
    updatedAt: dateToIso(row.updated_at),
  };
}

async function readLocalRequests(): Promise<LocalRequest[]> {
  try {
    const value: unknown = JSON.parse(await readFile(storePath, 'utf8'));
    if (!Array.isArray(value)) throw new Error('Local request storage contains invalid data.');
    return value as LocalRequest[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

async function writeLocalRequests(requests: LocalRequest[]) {
  await mkdir(dirname(storePath), { recursive: true });
  const temporaryPath = `${storePath}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(requests, null, 2), 'utf8');
  await rename(temporaryPath, storePath);
}

export async function createBusinessRequest(draft: BusinessRequestDraft): Promise<BusinessRequest> {
  if (requestStorageMode() === 'tidb') {
    const [result] = await getTiDBPool().execute<ResultSetHeader>(
      `INSERT INTO business_requests
        (request_type, full_name, organization, email, phone, country, subject, category, requirements, scope, delivery_location, internal_notes, response_message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', '')`,
      [draft.type, draft.fullName, draft.organization, draft.email, draft.phone, draft.country, draft.subject, draft.category, draft.requirements, draft.scope, draft.deliveryLocation],
    );
    const id = Number(result.insertId);
    if (!Number.isSafeInteger(id) || id < 1) throw new Error('Request storage did not return a valid request ID.');
    const saved = await getBusinessRequest(id);
    if (!saved) throw new Error('Request storage could not verify the submitted request.');
    return saved;
  }
  if (requestStorageMode() === 'local') {
    const requests = await readLocalRequests();
    const now = new Date().toISOString();
    const {
      type, fullName, organization, email, phone, country, subject, category,
      requirements, scope, deliveryLocation,
    } = draft;
    const request: BusinessRequest = {
      type, fullName, organization, email, phone, country, subject, category,
      requirements, scope, deliveryLocation,
      id: Math.max(0, ...requests.map((item) => item.id)) + 1,
      status: 'new',
      internalNotes: '',
      responseMessage: '',
      quoteAmount: null,
      quoteCurrency: '',
      consentedAt: now,
      submittedAt: now,
      updatedAt: now,
    };
    await writeLocalRequests([request, ...requests]);
    return request;
  }
  throw new Error('Request storage is not configured for this deployment.');
}

const requestColumns = '`id`, `request_type`, `full_name`, `organization`, `email`, `phone`, `country`, `subject`, `category`, `requirements`, `scope`, `delivery_location`, `status`, `internal_notes`, `response_message`, `quote_amount`, `quote_currency`, `consented_at`, `submitted_at`, `updated_at`';

export async function getBusinessRequests(): Promise<BusinessRequest[]> {
  if (requestStorageMode() === 'tidb') {
    const [rows] = await getTiDBPool().execute<RequestRow[]>(
      `SELECT ${requestColumns} FROM business_requests ORDER BY submitted_at DESC, id DESC LIMIT 500`,
    );
    return rows.map(toBusinessRequest);
  }
  if (requestStorageMode() === 'local') return readLocalRequests();
  throw new Error('Request storage is not configured for this deployment.');
}

export async function getBusinessRequest(id: number): Promise<BusinessRequest | undefined> {
  if (requestStorageMode() === 'tidb') {
    const [rows] = await getTiDBPool().execute<RequestRow[]>(
      `SELECT ${requestColumns} FROM business_requests WHERE id = ? LIMIT 1`,
      [id],
    );
    return rows[0] ? toBusinessRequest(rows[0]) : undefined;
  }
  if (requestStorageMode() === 'local') return (await readLocalRequests()).find((request) => request.id === id);
  throw new Error('Request storage is not configured for this deployment.');
}

export async function updateBusinessRequest(id: number, update: BusinessRequestUpdate): Promise<BusinessRequest | undefined> {
  if (requestStorageMode() === 'tidb') {
    await getTiDBPool().execute(
      `UPDATE business_requests SET status = ?, internal_notes = ?, response_message = ?, quote_amount = ?, quote_currency = ?
       WHERE id = ?`,
      [update.status, update.internalNotes, update.responseMessage, update.quoteAmount, update.quoteCurrency, id],
    );
    return getBusinessRequest(id);
  }
  if (requestStorageMode() === 'local') {
    const requests = await readLocalRequests();
    const existing = requests.find((request) => request.id === id);
    if (!existing) return undefined;
    const updated = { ...existing, ...update, updatedAt: new Date().toISOString() };
    await writeLocalRequests(requests.map((request) => request.id === id ? updated : request));
    return updated;
  }
  throw new Error('Request storage is not configured for this deployment.');
}
