import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkBreaks from 'remark-breaks';

export default defineConfig({
  site: 'https://tonkyshan.cn',
  trailingSlash: 'always',
  integrations: [mdx()],
  markdown: {
    // Hexo's marked renderer turned single newlines into <br>; old posts rely on it
    remarkPlugins: [remarkBreaks],
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    },
  },
});
