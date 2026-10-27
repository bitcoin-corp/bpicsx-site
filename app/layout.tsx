import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';
import { GET_WALLET_URL } from '@/lib/bpics';
import './globals.css';

const hf = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-hf', display: 'swap' });
const bf = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-bf', display: 'swap' });

const title = 'bPicsX · Pictures made for you. Private by default.';
const description =
  'bPicsX: AI pictures and greeting cards made for you, and your own photos minted on Bitcoin. Encrypted to your keys, public only if you choose Reveal, paid in bitcoin from bWalletX.';

export const metadata: Metadata = {
  metadataBase: new URL('https://bpicsx.com'),
  title: { default: title, template: '%s · bPicsX' },
  description,
  alternates: { canonical: '/' },
  manifest: '/manifest.json',
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/icon-192.png', sizes: '192x192' }], apple: '/apple-touch-icon.png' },
  openGraph: {
    type: 'website', siteName: 'bPicsX', url: 'https://bpicsx.com/', title, description,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'bPicsX: the gold b logo. Pictures and cards made for you. Private by default.' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/og-image.jpg'] },
};

export const viewport: Viewport = { themeColor: '#000000', width: 'device-width', initialScale: 1 };

function Brand({ size = 22 }: { size?: number }) {
  return (
    <Link className="brand" href="/" aria-label="bPicsX home">
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny SVG logo, nothing to optimise */}
      <img src="/logo.svg" alt="" width={size} height={Math.round(size * 1.36)} />
      <span>bPics<span className="gld">X</span></span>
    </Link>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hf.variable} ${bf.variable}`}>
      <body>
        <aside className="bwx-strip" aria-label="bWalletX">
          <a href="https://bwalletx.com">
            <svg viewBox="23 8 74 100" aria-hidden="true" focusable="false"><defs><linearGradient id="bwx-g" gradientUnits="userSpaceOnUse" x1="0" y1="12" x2="0" y2="105"><stop offset="0" stopColor="#FFE58A" /><stop offset=".55" stopColor="#FFD24D" /><stop offset="1" stopColor="#C98F00" /></linearGradient><mask id="bwx-m"><rect width="140" height="140" fill="#fff" /><circle cx="60" cy="72" r="15" fill="#000" /></mask></defs><g fill="url(#bwx-g)" mask="url(#bwx-m)"><polygon points="45,12 45,76 27,76 27,30" /><circle cx="60" cy="72" r="33" /></g></svg>
            <span>Part of <b>bWalletX</b></span><span className="bwx-go" aria-hidden="true">&rarr;</span>
          </a>
        </aside>
        <header className="wrap nav">
          <Brand />
          <nav className="nav-links" aria-label="Main">
            <Link className="hide-s" href="/#how">How it works</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/policy">Safety</Link>
            <a className="btn btn-gold hide-s" href={GET_WALLET_URL}>Get bWalletX</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="wrap foot">
          <Brand size={18} />
          <nav aria-label="Footer">
            <Link href="/gallery">Gallery</Link>
            <Link href="/policy">Safety policy</Link>
            <Link href="/report">Report a picture</Link>
            <a href="https://bwalletx.com">bWalletX</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
