import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/gallery', '/policy'].map((p) => ({ url: `https://bpicsx.com${p}` }));
}
