import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { NextResponse } from 'next/server';
import { hasAdminSession, isSameOriginRequest } from '@/lib/admin-auth';
import { isWordPressAdminConfigured, uploadWordPressMedia } from '@/lib/wordpress-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const maxBytes = 5 * 1024 * 1024;
const imageTypes = {
  'image/jpeg': { extension: 'jpg', matches: (bytes: Buffer) => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  'image/png': { extension: 'png', matches: (bytes: Buffer) => bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
  'image/webp': { extension: 'webp', matches: (bytes: Buffer) => bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' },
  'image/gif': { extension: 'gif', matches: (bytes: Buffer) => bytes.length >= 6 && ['GIF87a', 'GIF89a'].includes(bytes.toString('ascii', 0, 6)) },
} as const;

const noStore = { 'Cache-Control': 'no-store' };

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: 'Sign in is required.' }, { status: 401, headers: noStore });
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: 'Request origin was rejected.' }, { status: 403, headers: noStore });

  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBytes + 65536) {
    return NextResponse.json({ error: 'Image must be 5 MB or smaller.' }, { status: 413, headers: noStore });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Choose a supported image file.' }, { status: 400, headers: noStore });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400, headers: noStore });
  if (file.size < 1 || file.size > maxBytes) return NextResponse.json({ error: 'Image must be between 1 byte and 5 MB.' }, { status: 413, headers: noStore });

  const imageType = imageTypes[file.type as keyof typeof imageTypes];
  if (!imageType) return NextResponse.json({ error: 'Use a JPEG, PNG, WebP, or GIF image.' }, { status: 415, headers: noStore });

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!imageType.matches(bytes)) return NextResponse.json({ error: 'The file content does not match its image type.' }, { status: 415, headers: noStore });

  const filename = `${randomUUID()}.${imageType.extension}`;
  try {
    if (isWordPressAdminConfigured()) {
      const url = await uploadWordPressMedia(filename, file.type, bytes);
      return NextResponse.json({ url }, { headers: noStore });
    }
    if (process.env.WORDPRESS_API_URL || process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Image storage is not configured for this server.' }, { status: 503, headers: noStore });
    }

    const uploadDirectory = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDirectory, { recursive: true });
    await writeFile(join(uploadDirectory, filename), bytes, { flag: 'wx', mode: 0o644 });
    return NextResponse.json({ url: `/uploads/${filename}` }, { headers: noStore });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Image could not be uploaded.';
    return NextResponse.json({ error: message }, { status: 502, headers: noStore });
  }
}