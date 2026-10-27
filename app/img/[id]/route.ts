import { NextResponse } from 'next/server';
import { SAFE_IMAGE, fetchFeed, isOutpoint, ordfsUrl } from '@/lib/bpics';

/**
 * GET /img/<txid_vout> — serves an approved gallery image from bpicsx.com's OWN origin.
 *
 * Why: the owner chose the Cloudflare CSAM Scanning Tool (27 Oct 2026). It scans only images served
 * through a Cloudflare-proxied zone, so a browser loading straight from ordfs.network is never scanned.
 * Once bpicsx.com is proxied, every gallery image passes Cloudflare's scanner through this route.
 *
 * Rules: ids must be in the approved public feed (anything else 404s), the upstream content type must be
 * a raster image, the body is capped at MAX_BYTES, and nothing is passed through but the bytes.
 */
const MAX_BYTES = 8 * 1024 * 1024;
const NOT_FOUND = () => new NextResponse('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = raw.toLowerCase();
  if (!isOutpoint(id)) return NOT_FOUND();

  // Approved feed only (cached 60 s, same as the gallery). A removed item drops out within a minute.
  const { items } = await fetchFeed();
  if (!items.some((i) => i.id === id)) return NOT_FOUND();

  let res: Response;
  try {
    res = await fetch(ordfsUrl(id), { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10_000) });
  } catch {
    return new NextResponse('Upstream unavailable', { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
  if (!res.ok || !res.body) return new NextResponse('Upstream unavailable', { status: 502, headers: { 'Cache-Control': 'no-store' } });

  const type = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (!SAFE_IMAGE.has(type)) return new NextResponse('Unsupported type', { status: 415, headers: { 'Cache-Control': 'no-store' } });
  const declared = Number(res.headers.get('content-length') || 0);
  if (declared > MAX_BYTES) return new NextResponse('Too large', { status: 413, headers: { 'Cache-Control': 'no-store' } });

  // Read with a hard cap: content-length can be missing or wrong.
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX_BYTES) {
      await reader.cancel().catch(() => {});
      return new NextResponse('Too large', { status: 413, headers: { 'Cache-Control': 'no-store' } });
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { body.set(c, off); off += c.byteLength; }

  return new NextResponse(body, {
    headers: {
      'Content-Type': type,
      'Content-Length': String(total),
      // Short edge cache so a takedown stops being served quickly; inscriptions never change.
      'Cache-Control': 'public, max-age=300, s-maxage=600',
      'Content-Security-Policy': "default-src 'none'; sandbox",
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
