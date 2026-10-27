import type { Metadata } from 'next';
import Link from 'next/link';
import ReportForm from './ReportForm';
import { isOutpoint } from '@/lib/bpics';

export const metadata: Metadata = { title: 'Report a picture', robots: { index: false } };

export default async function Report({ searchParams }: { searchParams: Promise<{ item?: string }> }) {
  const { item } = await searchParams;
  const id = typeof item === 'string' && isOutpoint(item.toLowerCase()) ? item.toLowerCase() : '';
  return (
    <div className="wrap page">
      <p className="eyebrow">bPicsX · report</p>
      <h1>Report <span>a picture.</span></h1>
      <p className="lede">Tell us what&apos;s wrong. A child-safety report hides the picture at once and sends it to a person. Other reports hide it once several people report it. You don&apos;t need to sign in.</p>
      <ReportForm initialItem={id} />
      <p className="hint">How we handle reports: <Link href="/policy#report">safety policy</Link>.</p>
    </div>
  );
}
