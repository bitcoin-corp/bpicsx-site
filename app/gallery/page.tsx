import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { WALLET_BPICS_URL, fetchFeed, formatSats, previewUrl } from '@/lib/bpics';

export const metadata: Metadata = {
  title: 'Public gallery',
  description: 'Pictures their owners chose to make public on bPicsX. Every one passed review.',
  alternates: { canonical: '/gallery' },
};
export const revalidate = 60;

const short = (k: string) => (k.length > 14 ? `${k.slice(0, 8)}…${k.slice(-4)}` : k);

export default async function Gallery() {
  const { items, open, error } = await fetchFeed();
  return (
    <div className="wrap page">
      <p className="eyebrow">bPicsX · public gallery</p>
      <h1>Revealed <span>by their owners.</span></h1>
      <p className="lede">Only pictures their owners chose to make public, and that passed review, appear here. Everything else stays private in its owner&apos;s wallet.</p>

      {items.length === 0 ? (
        <div className="empty" role="status">
          <b>{open && !error ? 'Nothing revealed yet' : 'The gallery opens soon'}</b>
          {open && !error
            ? 'When someone reveals a picture and it passes review, it shows up here.'
            : 'Public pictures appear once safety scanning is switched on. Until then everything stays private.'}
          <div className="ctas" style={{ justifyContent: 'center', marginTop: 24 }}>
            <a className="btn btn-gold" href={WALLET_BPICS_URL}>Open bPics in bWalletX</a>
          </div>
        </div>
      ) : (
        <div className="grid">
          {items.map((it, i) => (
            <figure className="item" key={it.id}>
              <div className="img">
                <Image src={previewUrl(it.id)} alt={it.title || 'Untitled picture'} fill sizes="(max-width:600px) 100vw, 280px" priority={i < 4} />
              </div>
              <figcaption>
                <b>{it.title || 'Untitled'}</b>
                <span className="by">by {it.paymail || short(it.creator_key)}</span>
                <span className="row">
                  <span>{formatSats(it.price_sats)}</span>
                  <Link className="report" href={`/report?item=${encodeURIComponent(it.id)}`} rel="nofollow">Report</Link>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      <p className="hint">See something wrong? Use Report on the picture, or read the <Link href="/policy">safety policy</Link>.</p>
    </div>
  );
}
