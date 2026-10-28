import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = (await getPosts()).filter((p) => !p.isLegacy);
  return rss({
    title: 'ShanTianQi',
    description: 'Blog of ShanTianQi, backend engineer working on autonomous driving and AI.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.date,
      link: `/${post.path}/`,
    })),
  });
}
