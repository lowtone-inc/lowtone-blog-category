import type { APIContext } from 'astro';
import { getCategoryGroups, getPosts, pageUrl, postUrl, totalPagesOf } from '@/lib/posts';
import { categoryUrl, withBase } from '@/lib/url';

interface Entry {
  path: string;
  lastmod?: Date;
}

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// /sitemap.xml 은 기존 Jekyll 경로 유지를 위해 직접 생성한다. (404는 제외)
export async function GET(context: APIContext) {
  const posts = await getPosts();
  const groups = await getCategoryGroups();
  const lastPage = totalPagesOf(posts.length);

  const entries: Entry[] = [
    { path: withBase('/') },
    ...Array.from({ length: lastPage - 1 }, (_, i) => ({ path: pageUrl(i + 2) })),
    { path: withBase('/about/') },
    { path: withBase('/categories/') },
    ...groups.map((group) => ({ path: categoryUrl(group.key) })),
    ...posts.map((post) => ({ path: postUrl(post), lastmod: post.data.updatedDate ?? post.data.pubDate })),
  ];

  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = escapeXml(new URL(path, context.site).href);
      const mod = lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : '';
      return `<url><loc>${loc}</loc>${mod}</url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
