import { NextRequest, NextResponse } from 'next/server';
import { API_BASE, REPORT_REASONS, isOutpoint } from '@/lib/bpics';

/**
 * Same-origin relay to bit-sign POST /api/bitsign/bpics/report. bit-sign's middleware blocks cross-site
 * POSTs from the browser, so the report form posts here and this forwards it unchanged (no auth, no
 * secrets). Validation mirrors bit-sign's parseReportBody so bad input never leaves this site.
 */
export async function POST(request: NextRequest) {
  const b = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const itemId = String(b?.item_id ?? '').toLowerCase();
  const reason = String(b?.reason ?? '');
  const details = String(b?.details ?? '').slice(0, 1000);
  if (!isOutpoint(itemId)) return NextResponse.json({ error: 'item_id must be <txid>_<vout>' }, { status: 400 });
  if (!REPORT_REASONS.some((r) => r.value === reason)) return NextResponse.json({ error: 'Pick a reason' }, { status: 400 });

  const fwd = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  try {
    const res = await fetch(`${API_BASE}/api/bitsign/bpics/report`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(fwd ? { 'x-forwarded-for': fwd } : {}) },
      body: JSON.stringify({ item_id: itemId, reason, details }),
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });
    const out = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    return NextResponse.json(res.ok ? { ok: true } : { error: out.error || 'Could not report' }, { status: res.ok ? 200 : res.status });
  } catch {
    return NextResponse.json({ error: 'Report service unreachable. Please try again.' }, { status: 502 });
  }
}
