// 掘金 via its web API (there is no public one). Login once in a dedicated Chrome window:
//
//   node scripts/share/juejin.ts login     # cookies saved to ~/.config/blog-share/juejin-cookies.json
//   node scripts/share/juejin.ts whoami
//
// The session lasts about a month; when it expires, publishing fails with "not logged in".

import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CONF = join(homedir(), '.config', 'blog-share');
const COOKIES = join(CONF, 'juejin-cookies.json');
const API = 'https://api.juejin.cn';
const UUID = randomUUID();
const q = `aid=2608&uuid=${UUID}`;

type Cookie = { name: string; value: string; domain: string };

function cookieHeader() {
  if (!existsSync(COOKIES)) throw new Error('掘金 not logged in: run `node scripts/share/juejin.ts login`');
  const cookies: Cookie[] = JSON.parse(readFileSync(COOKIES, 'utf8'));
  return cookies.filter((c) => c.domain.endsWith('juejin.cn')).map((c) => `${c.name}=${c.value}`).join('; ');
}

async function call(path: string, init: RequestInit & { csrf?: string } = {}) {
  const res = await fetch(`${API}${path}${path.includes('?') ? '&' : '?'}${q}`, {
    ...init,
    headers: {
      cookie: cookieHeader(),
      origin: 'https://juejin.cn',
      referer: 'https://juejin.cn/',
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Safari/537.36',
      ...(init.csrf ? { 'x-secsdk-csrf-token': init.csrf } : {}),
      ...(init.headers as Record<string, string>),
    },
  });
  const data = await res.json();
  if (data.err_no !== 0) throw new Error(`掘金 ${path}: ${data.err_no} ${data.err_msg}`);
  return data.data;
}

async function csrfToken() {
  const res = await fetch(`${API}/user_api/v1/sys/token`, {
    method: 'HEAD',
    headers: { cookie: cookieHeader(), 'x-secsdk-csrf-request': '1', 'x-secsdk-csrf-version': '1.2.10' },
  });
  const token = res.headers.get('x-ware-csrf-token')?.split(',')[1];
  if (!token) throw new Error('掘金: no CSRF token (session expired? run login again)');
  return token;
}

export async function whoami(): Promise<string> {
  const u = await call('/user_api/v1/user/get');
  return u.user_name;
}

async function categoryId(name: string) {
  const cats: { category_id: string; category_name: string }[] = await call('/tag_api/v1/query_category_briefs');
  return (cats.find((c) => c.category_name === name) ?? cats.find((c) => c.category_name === '人工智能') ?? cats[0]).category_id;
}

async function tagIds(names: string[], csrf: string) {
  const ids: string[] = [];
  for (const name of names) {
    const tags: { tag_id: string; tag: { tag_name: string } }[] = await call('/tag_api/v1/query_tag_list', {
      method: 'POST', csrf, body: JSON.stringify({ cursor: '0', key_word: name, limit: 10, sort_type: 1 }),
    });
    const hit = tags.find((t) => t.tag.tag_name.toLowerCase() === name.toLowerCase()) ?? tags[0];
    if (hit) ids.push(hit.tag_id);
  }
  if (!ids.length) throw new Error(`掘金: none of the tags exist: ${names.join(', ')}`);
  return [...new Set(ids)].slice(0, 3);
}

// 掘金 rejects summaries outside 50–100 characters; cut at the last sentence end that fits
function fitBrief(b: string) {
  if (b.length <= 100) {
    if (b.length < 50) throw new Error(`掘金: summary too short (${b.length} chars, needs 50–100)`);
    return b;
  }
  const cut = b.slice(0, 100);
  const end = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('；'), cut.lastIndexOf('！'), cut.lastIndexOf('？'));
  return end >= 49 ? cut.slice(0, end + 1) : cut.slice(0, 99) + '…';
}

// Returns the article URL, or the draft URL with draftOnly
export async function publishToJuejin(a: { title: string; brief: string; category: string; tags: string[]; markdown: string; draftOnly?: boolean }) {
  const brief = fitBrief(a.brief);
  const csrf = await csrfToken();
  const draft = await call('/content_api/v1/article_draft/create', {
    method: 'POST', csrf,
    body: JSON.stringify({
      category_id: await categoryId(a.category),
      tag_ids: await tagIds(a.tags, csrf),
      link_url: '', cover_image: '', title: a.title, brief_content: brief,
      edit_type: 10, html_content: 'deprecated', mark_content: a.markdown, theme_ids: [],
    }),
  });
  if (a.draftOnly) return `https://juejin.cn/editor/drafts/${draft.id}`;
  const post = await call('/content_api/v1/article/publish', {
    method: 'POST', csrf, body: JSON.stringify({ draft_id: draft.id, sync_to_org: false, column_ids: [], theme_ids: [] }),
  });
  return `https://juejin.cn/post/${post.article_id}`;
}

// Opens a separate Chrome profile on the login page and saves the cookies once you're in
async function login() {
  mkdirSync(CONF, { recursive: true });
  const port = 9333;
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    `--user-data-dir=${join(CONF, 'chrome')}`, `--remote-debugging-port=${port}`, '--no-first-run', 'https://juejin.cn/login',
  ], { stdio: 'ignore' });
  console.log('Log in to 掘金 in the Chrome window that just opened...');
  for (let i = 0; i < 300; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    let ws: string;
    try {
      ws = (await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()).webSocketDebuggerUrl;
    } catch { continue; }
    const cookies = await new Promise<Cookie[]>((resolve, reject) => {
      const sock = new WebSocket(ws);
      sock.onopen = () => sock.send(JSON.stringify({ id: 1, method: 'Storage.getCookies' }));
      sock.onmessage = (m) => { resolve(JSON.parse(String(m.data)).result?.cookies ?? []); sock.close(); };
      sock.onerror = reject;
    });
    const jj = cookies.filter((c) => c.domain.endsWith('juejin.cn'));
    if (jj.some((c) => c.name === 'sessionid' && c.value)) {
      writeFileSync(COOKIES, JSON.stringify(jj.map(({ name, value, domain }) => ({ name, value, domain })), null, 2));
      chmodSync(COOKIES, 0o600);
      console.log(`Logged in as ${await whoami()}. Cookies saved to ${COOKIES}`);
      chrome.kill();
      return;
    }
  }
  chrome.kill();
  throw new Error('timed out waiting for 掘金 login');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  (cmd === 'login' ? login() : cmd === 'whoami' ? whoami().then(console.log) : Promise.reject(new Error('usage: juejin.ts login|whoami')))
    .catch((e) => { console.error(e.message ?? e); process.exit(1); });
}
