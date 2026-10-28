/* global hexo */
'use strict';

const isDaily = post => /前沿日报/.test(post.title || '');

hexo.extend.helper.register('is_daily', isDaily);

// Posts before theme.fresh_start belong to the old blog and are listed on /legacy/ only
hexo.extend.helper.register('is_legacy', function (post) {
  return post.date.isBefore(this.theme.fresh_start);
});

hexo.extend.generator.register('tq-legacy', function (locals) {
  const start = this.theme.config.fresh_start;
  const old = locals.posts.sort('-date').filter(p => p.date.isBefore(start));
  return {
    path: 'legacy/index.html',
    layout: ['legacy'],
    data: {
      title: 'Archive',
      notes: old.filter(p => !isDaily(p)),
      dailies: old.filter(isDaily)
    }
  };
});
