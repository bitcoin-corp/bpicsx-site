'use client';

import { useState } from 'react';
import { REPORT_REASONS, isOutpoint } from '@/lib/bpics';

/**
 * Posts STRAIGHT to bit-sign from the browser, so bit-sign sees the reporter's own IP (its 10/min limit and
 * "3 different reporters hide it" rule depend on that; a server relay makes everyone look like one IP).
 * bit-sign allows CORS from the bpicsx origins on this one path, without credentials.
 *
 * Fallback: only if the direct request fails at the network level (bit-sign unreachable or not yet
 * allowing this origin), we post to our own /api/report relay so a report is never lost. A reply from
 * bit-sign, including an error or a 429, is final and is never retried through the relay.
 */
async function send(apiBase: string, body: string): Promise<Response | null> {
  try {
    return await fetch(`${apiBase}/api/bitsign/bpics/report`, {
      method: 'POST', mode: 'cors', credentials: 'omit', headers: { 'content-type': 'application/json' }, body,
    });
  } catch {
    return fetch('/api/report', { method: 'POST', headers: { 'content-type': 'application/json' }, body }).catch(() => null);
  }
}

export default function ReportForm({ initialItem, apiBase }: { initialItem: string; apiBase: string }) {
  const [item, setItem] = useState(initialItem);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [state, setState] = useState<{ kind: 'idle' | 'busy' | 'ok' | 'err'; msg?: string }>({ kind: 'idle' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const id = item.trim().toLowerCase();
    if (!isOutpoint(id)) return setState({ kind: 'err', msg: 'The picture ID looks like <txid>_<number>. Use the Report link on the picture.' });
    if (!reason) return setState({ kind: 'err', msg: 'Pick a reason.' });
    setState({ kind: 'busy' });
    const res = await send(apiBase, JSON.stringify({ item_id: id, reason, details }));
    const out = (await res?.json().catch(() => ({}))) as { error?: string } | undefined;
    if (res?.ok) setState({ kind: 'ok', msg: 'Thank you. Your report has been sent.' });
    else setState({ kind: 'err', msg: out?.error || 'Could not send the report. Please try again.' });
  }

  if (state.kind === 'ok') return <p className="msg ok" role="status" style={{ marginTop: 32, maxWidth: 560 }}>{state.msg}</p>;
  return (
    <form className="form" onSubmit={submit} noValidate>
      <label>Picture ID<input value={item} onChange={(e) => setItem(e.target.value)} placeholder="txid_0" autoComplete="off" spellCheck={false} /></label>
      <label>Reason
        <select value={reason} onChange={(e) => setReason(e.target.value)} required>
          <option value="">Choose a reason</option>
          {REPORT_REASONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </label>
      <label>Details (optional)<textarea value={details} onChange={(e) => setDetails(e.target.value)} maxLength={1000} placeholder="What's wrong with it?" /></label>
      {state.kind === 'err' && <p className="msg err" role="alert">{state.msg}</p>}
      <div><button className="btn btn-gold" type="submit" disabled={state.kind === 'busy'}>{state.kind === 'busy' ? 'Sending…' : 'Send report'}</button></div>
    </form>
  );
}
