// Render 小红书 image cards (3:4, 1080×1440) with headless Chrome.

import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function page(card: { title: string; lines: string[] }, i: number, n: number) {
  const cover = i === 0;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1440px; background: #f6f4ef; color: #1d1d1f;
         font-family: "PingFang SC", "Hiragino Sans GB", sans-serif;
         padding: 120px 100px; display: flex; flex-direction: column; justify-content: center; position: relative; }
  .bar { width: 96px; height: 12px; background: #1d1d1f; margin-bottom: 64px; }
  h1 { font-size: ${cover ? 112 : 84}px; line-height: 1.25; font-weight: 700; text-wrap: balance; }
  p { font-size: ${cover ? 54 : 54}px; line-height: 1.55; color: ${cover ? '#555' : '#333'}; margin-top: ${cover ? 72 : 36}px; text-wrap: balance; }
  .lines { margin-top: ${cover ? 24 : 72}px; }
  .n { position: absolute; bottom: 80px; right: 100px; font-size: 34px; color: #999; }
  </style></head><body>
  <div class="bar"></div>
  <h1>${esc(card.title)}</h1>
  <div class="lines">${card.lines.map((l) => `<p>${esc(l)}</p>`).join('')}</div>
  ${n > 1 ? `<div class="n">${i + 1} / ${n}</div>` : ''}
  </body></html>`;
}

export async function renderCards(cards: { title: string; lines: string[] }[], dir: string) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const tmp = join(dir, '.html');
  mkdirSync(tmp, { recursive: true });
  cards.forEach((card, i) => {
    const html = join(tmp, `${i + 1}.html`);
    writeFileSync(html, page(card, i, cards.length));
    execFileSync(CHROME, [
      '--headless=new', '--hide-scrollbars', '--force-device-scale-factor=1',
      '--window-size=1080,1440', `--screenshot=${join(dir, `${String(i + 1).padStart(2, '0')}.png`)}`, `file://${html}`,
    ], { stdio: 'ignore' });
  });
  rmSync(tmp, { recursive: true, force: true });
}
