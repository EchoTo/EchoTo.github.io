/* global hexo */
'use strict';

hexo.extend.helper.register('is_daily', post => /前沿日报/.test(post.title || ''));
