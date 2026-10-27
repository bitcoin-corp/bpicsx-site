import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrap page">
      <h1>Not <span>found.</span></h1>
      <p className="lede">That page doesn&apos;t exist. <Link href="/">Back to bPicsX</Link>.</p>
    </div>
  );
}
