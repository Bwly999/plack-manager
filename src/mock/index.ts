import Mock from 'mockjs';

import './user';
import './message-box';

import '@/views/dashboard/workplace/mock';

import '@/views/dashboard/data-analysis/mock';

import '@/views/user/info/mock';
import '@/views/user/setting/mock';

import '@/views/news/news-list/mock';

Mock.setup({
  timeout: '600-1000',
});
