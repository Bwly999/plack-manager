import { DEFAULT_LAYOUT } from '@/router/constans';

export default {
  path: '/goods',
  name: 'goods',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.goods',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'goods-list', // The midline path complies with SEO specifications
      name: 'GoodsList',
      component: () => import('@/views/goods/goods-list/index.vue'),
      meta: {
        locale: 'menu.goods.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'onshelf',
      name: 'GoodsOnshelf',
      component: () => import('@/views/goods/onshelf/index.vue'),
      meta: {
        locale: 'menu.goods.onshelf',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'change',
      name: 'GoodsChange',
      component: () => import('@/views/goods/change/index.vue'),
      meta: {
        locale: 'menu.goods.change',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};
