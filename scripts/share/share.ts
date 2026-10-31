// Share a published post to other platforms.
//
//   node scripts/share/share.ts <slug> [--only x,juejin,xhs] [--regen]
//   node scripts/share/share.ts --new            # every post not yet in state.json
//
// X and 小红书 copy goes to Apple Notes (folder 博客分发) for posting by hand;
// 小红书 cards are rendered to ~/Desktop/小红书/<slug>/. 掘金 is published through its web API.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { publishToJuejin } from './juejin.ts';
import { renderCards } from './cards.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const SITE = 'https://tonkyshan.cn';
const STATE = join(HERE, 'state.json');
const CACHE = join(homedir(), '.cache', 'blog-share');
const FRESH_START = '2026-10-28'; // older posts are the archive, never shared

type Post = { slug: string; title: string; date: string; draft: boolean; body: string; en?: { title: string; body: string } };
export type Copy = {
  x: string[];
  juejin: { title: string; brief: string; category: string; tags: string[] };
  xhs: { title: string; body: string; tags: string[]; cards: { title: string; lines: string[] }[] };
};
type State = Record<string, Partial<Record<'x' | 'juejin' | 'xhs', string>>>;

function readPost(slug: string): Post {
  const parse = (file: string) => {
    const raw = readFileSync(file, 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) throw new Error(`no frontmatter: ${file}`);
    const field = (k: string) => m[1].match(new RegExp(`^${k}:\\s*(.*)$`, 'm'))?.[1].trim().replace(/^["']|["']$/g, '') ?? '';
    return { field, body: m[2].trim() };
  };
  const zh = parse(join(ROOT, 'src/content/posts', `${slug}.md`));
  const enFile = join(ROOT, 'src/content/posts-en', `${slug}.md`);
  const en = existsSync(enFile) ? parse(enFile) : undefined;
  return {
    slug,
    title: zh.field('title'),
    date: zh.field('date'),
    draft: zh.field('draft') === 'true',
    body: zh.body,
    en: en && { title: en.field('title'), body: en.body },
  };
}

export const postUrl = (p: Post, lang: 'zh' | 'en' = 'zh') => {
  const [y, m, d] = p.date.slice(0, 10).split('-');
  return `${SITE}/${y}/${m}/${d}/${p.slug}/${lang === 'en' ? 'en/' : ''}`;
};

// Copy is generated once per post and cached, so re-running a step doesn't produce different text
function generateCopy(p: Post, regen: boolean): Copy {
  const cached = join(CACHE, `${p.slug}.json`);
  if (!regen && existsSync(cached)) return JSON.parse(readFileSync(cached, 'utf8'));
  const prompt = [
    readFileSync(join(HERE, 'style.md'), 'utf8'),
    '---',
    `中文原文链接：${postUrl(p)}`,
    p.en ? `英文版链接：${postUrl(p, 'en')}` : '没有英文版：X 推文串由你从中文原文翻译。',
    `# 中文原文：${p.title}\n\n${p.body}`,
    p.en ? `# 英文版：${p.en.title}\n\n${p.en.body}` : '',
    '---',
    '按上面的规则输出一个 JSON 对象，不要输出别的内容，不要用代码块包起来。格式：',
    '{"x": ["第1条", "第2条", ...], "juejin": {"title": "", "brief": "", "category": "人工智能", "tags": ["", ""]},',
    ' "xhs": {"title": "", "body": "", "tags": ["#标签"], "cards": [{"title": "封面大字", "lines": ["副标题"]}, {"title": "要点", "lines": ["说明1", "说明2"]}]}}',
  ].join('\n\n');
  const out = execFileSync('claude', ['-p', prompt, '--output-format', 'json'], { encoding: 'utf8', maxBuffer: 32 << 20, cwd: CACHE });
  const text: string = JSON.parse(out).result;
  const copy: Copy = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
  writeFileSync(cached, JSON.stringify(copy, null, 2));
  return copy;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Apple Notes: one note per post and platform, in folder 博客分发 (replaced if it exists)
function saveNote(name: string, paragraphs: string[]) {
  const html = `<h1>${esc(name)}</h1>` + paragraphs.map((p) => `<div>${esc(p).replace(/\n/g, '<br>')}</div><div><br></div>`).join('');
  const script = `
    on run argv
      set noteName to item 1 of argv
      set noteBody to item 2 of argv
      tell application "Notes"
        if not (exists folder "博客分发") then make new folder with properties {name:"博客分发"}
        set f to folder "博客分发"
        delete (every note of f whose name is noteName)
        make new note at f with properties {body:noteBody}
      end tell
    end run`;
  execFileSync('osascript', ['-e', script, name, html]);
}

function loadState(): State {
  return existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : {};
}

async function share(slug: string, only: string[], regen: boolean) {
  const p = readPost(slug);
  if (p.draft) throw new Error(`${slug} is a draft`);
  mkdirSync(CACHE, { recursive: true });
  const copy = generateCopy(p, regen);
  const state = loadState();
  state[slug] ??= {};
  const now = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Shanghai' }).slice(0, 16);

  if (only.includes('x')) {
    saveNote(`X · ${p.title}`, copy.x.map((t, i) => `${i + 1}/\n${t}`));
    state[slug].x = `notes ${now}`;
    console.log('x: saved to Notes');
  }
  if (only.includes('xhs')) {
    const dir = join(homedir(), 'Desktop', '小红书', slug);
    await renderCards(copy.xhs.cards, dir);
    saveNote(`小红书 · ${p.title}`, [
      `【标题】\n${copy.xhs.title}`,
      `【正文】\n${copy.xhs.body}\n\n${copy.xhs.tags.join(' ')}`,
      `【图片】${dir}（${copy.xhs.cards.length} 张，按文件名顺序上传）`,
      '发布时勾选「内容包含 AI 辅助」声明。正文里不要加链接。',
    ]);
    state[slug].xhs = `notes ${now}`;
    console.log(`xhs: saved to Notes, cards in ${dir}`);
  }
  if (only.includes('juejin')) {
    // never publish the same post twice, even with --regen; delete it from state.json to redo
    if (state[slug].juejin?.startsWith('https://')) {
      console.log(`juejin: already published ${state[slug].juejin}`);
    } else {
      const body = `${p.body}\n\n---\n\n首发于我的博客：[${postUrl(p)}](${postUrl(p)})`;
      const url = await publishToJuejin({ ...copy.juejin, markdown: absolutize(body) });
      state[slug].juejin = url;
      console.log(`juejin: published ${url}`);
    }
  }
  writeFileSync(STATE, JSON.stringify(state, null, 2) + '\n');
}

// Images and internal links in posts are site-relative; elsewhere they must be absolute
const absolutize = (md: string) => md.replace(/\]\((\/[^)\s]*)\)/g, `](${SITE}$1)`);

async function main() {
  const args = process.argv.slice(2);
  const get = (f: string) => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : undefined; };
  const only = (get('--only') ?? 'x,juejin,xhs').split(',');
  const regen = args.includes('--regen');
  let slugs = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--only');
  if (args.includes('--new')) {
    const state = loadState();
    slugs = readdirSync(join(ROOT, 'src/content/posts'))
      .filter((f) => f.endsWith('.md'))
      .map((f) => f.slice(0, -3))
      .filter((s) => !state[s])
      .filter((s) => { const p = readPost(s); return !p.draft && p.date.slice(0, 10) >= FRESH_START; });
    if (!slugs.length) console.log('nothing new to share');
  }
  if (!slugs.length && !args.includes('--new')) {
    console.error('usage: node scripts/share/share.ts <slug> [--only x,juejin,xhs] [--regen] | --new');
    process.exit(2);
  }
  for (const s of slugs) {
    console.log(`== ${s}`);
    await share(s, only, regen);
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
