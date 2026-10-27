import Link from 'next/link';
import { GET_WALLET_URL, WALLET_BPICS_URL } from '@/lib/bpics';

export default function Home() {
  return (
    <>
      <section className="wrap hero" style={{ borderTop: 0 }}>
        <div>
          <p className="eyebrow">bPicsX · built on bWalletX</p>
          <h1>Pictures made for you. <span>Private by default.</span></h1>
          <p className="lede">
            AI pictures and greeting cards made to order, and your own photos minted on Bitcoin. Everything is encrypted
            to your keys. Nothing goes public unless you choose Reveal. You pay in bitcoin from your bWalletX.
          </p>
          <div className="ctas">
            <a className="btn btn-gold" href={WALLET_BPICS_URL}>Open bPics in bWalletX</a>
            <Link className="btn btn-ghost" href="/gallery">See the public gallery</Link>
          </div>
          <p className="hint">No wallet yet? <a href={GET_WALLET_URL}>Get bWalletX free</a> on the web, phone, desktop or Chrome.</p>
        </div>
        <div className="stage" role="img" aria-label="An example greeting card in bWalletX, private and encrypted to its owner, with a Reveal option.">
          <div className="phone"><div className="scr">
            <div className="sh"><span>bPics</span><span className="example">Example</span></div>
            <div className="card-art">
              <div className="art">
                <span className="lock">Private</span>
                <svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE27A" /><stop offset="1" stopColor="#E0A800" /></linearGradient></defs><rect x="24" y="30" width="72" height="60" rx="10" fill="none" stroke="url(#hg)" strokeWidth="6" /><circle cx="46" cy="50" r="7" fill="url(#hg)" /><path d="M30 84l22-22 14 14 10-10 16 18z" fill="url(#hg)" /></svg>
                <div className="t"><b>Happy birthday, Mum</b><span>Greeting card · made for you</span></div>
              </div>
              <div className="meta">
                <div className="ln"><span>Encrypted to</span><span>your keys</span></div>
                <div className="ln"><span>Paid from</span><span>your bWalletX</span></div>
                <div className="ln"><span>Visible to</span><span>only you</span></div>
              </div>
            </div>
            <div className="reveal"><span>Reveal to make it public</span></div>
          </div><span className="home" /></div>
        </div>
      </section>

      <section id="how">
        <div className="wrap">
          <p className="kicker">How it works</p>
          <h2>Yours first. <span className="gld">Public only if you say so.</span></h2>
          <p className="sub">Everything happens inside your own wallet. This site is the shop window, not the studio.</p>
          <ol className="steps">
            <li className="lead"><h3>Ask for a picture or a card</h3><p>Describe what you want: a portrait, a scene, a birthday or thank-you card. It&apos;s made for you with safety-filtered AI models, and every result is checked before you see it.</p></li>
            <li><h3>Or mint your own photos</h3><p>Add your photos and art. They&apos;re scanned on upload, then minted on Bitcoin from your bWalletX, so you hold them.</p></li>
            <li><h3>Private by default</h3><p>Your pictures are encrypted to your keys. Nobody else can open them, us included.</p></li>
            <li><h3>Reveal when you want</h3><p>Choose Reveal to make a picture public. It&apos;s checked again, and only then can it appear in the gallery.</p></li>
            <li><h3>Pay in bitcoin</h3><p>You pay from your own bWalletX. No card, no account, no subscription.</p></li>
          </ol>
          <p className="note"><b>We never publish for you.</b> A picture becomes public only when you choose Reveal and it passes review.</p>
        </div>
      </section>

      <section id="what">
        <div className="wrap">
          <p className="kicker">What you can make</p>
          <h2>Three things, one wallet.</h2>
          <div className="pair">
            <div className="me"><b>AI pictures</b><i>Made for you</i><p>Pictures made to your description, from filtered models only.</p></div>
            <div><b>Greeting cards</b><i>Birthdays, thanks, any day</i><p>A card made for one person, sent from your wallet.</p></div>
            <div><b>Your photos</b><i>Minted by you</i><p>Put your own photos and art on chain, encrypted until you choose otherwise.</p></div>
          </div>
        </div>
      </section>

      <section id="safety">
        <div className="wrap">
          <p className="kicker">Safety</p>
          <h2>Checked before anything is seen.</h2>
          <p className="sub">Uploads are scanned before they&apos;re encrypted. Generated pictures are checked before they can be revealed. Sexual content involving minors is never allowed, and anything can be reported.</p>
          <div className="ctas" style={{ marginTop: 32 }}>
            <Link className="btn btn-ghost" href="/policy">Read the safety policy</Link>
            <Link className="btn btn-ghost" href="/report">Report a picture</Link>
          </div>
        </div>
      </section>

      <section id="get">
        <div className="wrap">
          <p className="kicker">Start</p>
          <h2>bPics lives in bWalletX.</h2>
          <p className="sub">Open the wallet and tap bPics on the Mint page.</p>
          <div className="ctas" style={{ marginTop: 32 }}>
            <a className="btn btn-gold" href={WALLET_BPICS_URL}>Open bPics in bWalletX</a>
            <a className="btn btn-ghost" href={GET_WALLET_URL}>Get bWalletX</a>
          </div>
        </div>
      </section>
    </>
  );
}
