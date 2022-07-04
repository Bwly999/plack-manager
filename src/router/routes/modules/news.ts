import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
  path: '/news',
  name: 'News',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.news',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'news-list', // The midline path complies with SEO specifications
      name: 'NewsList',
      component: () => import('@/views/news/news-list/index.vue'),
      meta: {
        locale: 'menu.news.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'add',
      name: 'AddNews',
      component: () => import('@/views/news/add/index.vue'),
      meta: {
        locale: 'menu.news.add',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'change',
      name: 'GoodsChange',
      component: () => import('@/views/news/change/index.vue'),
      meta: {
        locale: 'menu.news.change',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};
