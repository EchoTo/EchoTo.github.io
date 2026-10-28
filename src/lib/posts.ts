import { getCollection, type CollectionEntry } from 'astro:content';

// Posts dated before this belong to the old blog and are listed under /archives/ only
export const FRESH_START = wallClock('2026-10-28 00:00:00');

export type Post = CollectionEntry<'posts'> & {
  path: string;
  date: Date;
  tags: string[];
  // Each entry is one category path, e.g. ['Python', '数据分析'] → /categories/Python/数据分析/
  categories: string[][];
  isDaily: boolean;
  isLegacy: boolean;
};

// Dates are wall-clock times (Asia/Shanghai, as Hexo used them); store them as UTC
// fields so formatting with UTC getters gives back exactly what the author wrote.
function wallClock(value: Date | string): Date {
  if (value instanceof Date) return value;
  const m = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (!m) throw new Error(`Unrecognised date: ${value}`);
  const [, y, mo, d, h = '0', mi = '0', s = '0'] = m;
  return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
}

const pad = (n: number) => String(n).padStart(2, '0');

function list(value: unknown): string[] {
  if (value == null) return [];
  return (Array.isArray(value) ? value.flat(Infinity) : [value]).map(String);
}

// Hexo semantics: `[A, B]` is one path (B under A); `[[A], [B, C]]` is several paths
function categoryPaths(value: unknown): string[][] {
  if (value == null) return [];
  if (!Array.isArray(value)) return [[String(value)]];
  if (value.some(Array.isArray)) return value.map((v) => list(v)).filter((p) => p.length);
  return value.length ? [value.map(String)] : [];
}

// Hexo's slugize(), so /tags/ and /categories/ URLs stay the same
export function slugize(str: string): string {
  return str
    .replace(/[\u0000-\u001f]/g, '')
    .replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(date: Date): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]}, ${date.getUTCFullYear()}`;
}

export type Group = { name: string; url: string; posts: Post[] };

// Tags that differ only in case (java / Java) share one page, like Hexo's output on macOS
export async function getTags(): Promise<Group[]> {
  const groups = new Map<string, Group & { names: Set<string> }>();
  for (const post of await getPosts()) {
    for (const name of post.tags) {
      const key = slugize(name).toLowerCase();
      if (!groups.has(key)) groups.set(key, { name, url: '', posts: [], names: new Set() });
      const g = groups.get(key)!;
      g.names.add(slugize(name));
      if (!g.posts.includes(post)) g.posts.push(post);
    }
  }
  return [...groups].map(([key, g]) => ({
    name: g.name,
    url: `/tags/${g.names.size > 1 ? key : [...g.names][0]}/`,
    posts: g.posts,
  }));
}

// One page per category and per ancestor of it
export async function getCategories(): Promise<Group[]> {
  const groups = new Map<string, Group>();
  for (const post of await getPosts()) {
    for (const path of post.categories) {
      for (let i = 1; i <= path.length; i++) {
        const url = `/categories/${path.slice(0, i).map(slugize).join('/')}/`;
        if (!groups.has(url)) groups.set(url, { name: path.slice(0, i).join(' / '), url, posts: [] });
        const g = groups.get(url)!;
        if (!g.posts.includes(post)) g.posts.push(post);
      }
    }
  }
  return [...groups.values()];
}

export async function tagUrl(name: string): Promise<string> {
  const key = slugize(name).toLowerCase();
  return (await getTags()).find((g) => g.url.toLowerCase() === `/tags/${key}/`)!.url;
}

let cache: Post[] | undefined;

export async function getPosts(): Promise<Post[]> {
  if (cache) return cache;
  const entries = await getCollection('posts');
  cache = entries
    .map((entry) => {
      const date = wallClock(entry.data.date);
      const path = entry.data.permalink
        ? entry.data.permalink.replace(/^\/+|\/+$/g, '')
        : `${date.getUTCFullYear()}/${pad(date.getUTCMonth() + 1)}/${pad(date.getUTCDate())}/${entry.id}`;
      return {
        ...entry,
        path,
        date,
        tags: list(entry.data.tags),
        categories: categoryPaths(entry.data.categories),
        isDaily: /前沿日报/.test(entry.data.title),
        isLegacy: date < FRESH_START,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  return cache;
}
