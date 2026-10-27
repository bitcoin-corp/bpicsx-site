import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Safety policy',
  description: 'How bPicsX keeps pictures safe: no sexual content involving minors, uploads scanned, generated pictures checked, and how to report.',
  alternates: { canonical: '/policy' },
};

export default function Policy() {
  return (
    <div className="wrap page prose">
      <p className="eyebrow">bPicsX · safety policy</p>
      <h1>Safety, <span>in plain words.</span></h1>
      <div className="rule"><p><strong>No sexual content involving anyone under 18. Ever.</strong> That includes AI-made pictures: UK law treats them the same as real ones, and so do we.</p></div>

      <h2>Your own photos are scanned on upload</h2>
      <ul>
        <li>Every photo you add is checked against lists of known child-abuse images <strong>before</strong> it is encrypted.</li>
        <li>We scan first because once a picture is encrypted to your keys, nobody can look at it. A match is blocked and never minted.</li>
      </ul>

      <h2>Made-for-you pictures are checked</h2>
      <ul>
        <li>We only use AI models with safety filters. We never use &ldquo;uncensored&rdquo; models.</li>
        <li>Requests that sexualise children, including code words, are refused.</li>
        <li>Every picture is checked automatically for nudity and apparent age before it can be revealed or made public. Anything sexual where someone could look under 18 is blocked.</li>
        <li>Characters from our adult brands are drawn and described as clearly adult, never in a childlike style.</li>
        <li>We keep a record of what we refuse, so we can show what we block.</li>
      </ul>

      <h2>Public means checked</h2>
      <ul>
        <li>Pictures are private by default. One appears in the <Link href="/gallery">public gallery</Link> only if its owner chooses Reveal and it passes review.</li>
        <li>Clean pictures are approved automatically. Anything flagged is looked at by a person.</li>
      </ul>

      <h2 id="report">How to report</h2>
      <ul>
        <li>Every picture in the gallery has a <strong>Report</strong> link. You can also use the <Link href="/report">report form</Link>. You don&apos;t need to sign in.</li>
        <li>A child-safety report hides the picture straight away and sends it to a person. Other reports hide a picture once several different people report it.</li>
        <li>Matches with known abuse images are blocked automatically and passed through the legal reporting route.</li>
        <li>If a child is in immediate danger, call 999. In the UK you can also report child sexual abuse images to the Internet Watch Foundation at <a href="https://report.iwf.org.uk">report.iwf.org.uk</a>.</li>
      </ul>

      <h2>What this site does</h2>
      <p>This site only shows the public gallery. Making, uploading and paying all happen inside your own bWalletX.</p>
    </div>
  );
}
