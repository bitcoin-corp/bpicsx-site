/**
 * Read-only client for the bit-sign bPics API (src/app/api/bitsign/bpics/* in bit-sign).
 *
 * GET  /api/bitsign/bpics/feed    → { items: PublicItem[], open?: false }  no auth. Approved + unhidden only,
 *                                   ranked by paid_sats. Returns [] with open:false until the market opens.
 * POST /api/bitsign/bpics/report  { item_id, reason, details? }  sign-in optional, rate-limited 10/min.
 *
 * This site never uploads, generates or pays. Escrow keys and classifier scores are never in the feed.
 */

export const API_BASE = (process.env.BPICS_API_BASE || 'https://www.bchatx.com').replace(/\/+$/, '');

/** Deep link into the wallet's bPics route (bWalletX web, route /m/bpics), same pattern as the bChatX links. */
export const WALLET_BPICS_URL = 'https://web.bwalletx.com/m/bpics';
export const GET_WALLET_URL = 'https://bwalletx.com/get';

/** Mirrors PUBLIC_FIELDS in bit-sign src/lib/bpics-service.ts. */
export interface PublicItem {
  id: string;
  source: 'mint' | 'claim';
  creator_key: string;
  pay_address: string | null;
  paymail: string | null;
  title: string;
  tags: string[];
  licence: string | null;
  price_sats: number | null;
  preview_type: string;
  status: string;
  paid_sats: number;
  created_at: string;
}

/** Mirrors REPORT_REASONS in bit-sign src/lib/bpics.ts. */
export const REPORT_REASONS = [
  { value: 'child_safety', label: 'Child safety (hidden at once)' },
  { value: 'nudity', label: 'Nudity or sexual content' },
  { value: 'violence', label: 'Violence' },
  { value: 'stolen', label: 'Stolen or not theirs' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Something else' },
] as const;
export type ReportReason = (typeof REPORT_REASONS)[number]['value'];

const OUTPOINT = /^[0-9a-f]{64}_\d{1,6}$/;
export const isOutpoint = (s: string) => OUTPOINT.test(s);
const SAFE_IMAGE = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/avif']);

/** The preview is the on-chain inscription at vout 0 (the item id), served by ORDFS. */
export const previewUrl = (id: string) => `https://ordfs.network/content/${id}`;

export type Feed = { items: PublicItem[]; open: boolean; error?: string };

/** Belt and braces: show only well-formed, approved, safe-image items even if the API changes. */
function clean(raw: unknown): PublicItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is PublicItem => {
    const i = x as Partial<PublicItem>;
    return typeof i?.id === 'string' && isOutpoint(i.id) && i.status === 'approved'
      && typeof i.preview_type === 'string' && SAFE_IMAGE.has(i.preview_type.toLowerCase());
  });
}

export async function fetchFeed(): Promise<Feed> {
  try {
    const res = await fetch(`${API_BASE}/api/bitsign/bpics/feed`, {
      next: { revalidate: 60 },
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { items: [], open: false, error: `Feed returned ${res.status}` };
    const body = (await res.json()) as { items?: unknown; open?: boolean };
    return { items: clean(body.items), open: body.open !== false };
  } catch {
    return { items: [], open: false, error: 'Feed unreachable' };
  }
}

export const formatSats = (n: number | null) =>
  n == null ? '' : n >= 100_000_000 ? `${(n / 1e8).toFixed(2)} BSV` : `${n.toLocaleString('en-GB')} sats`;
