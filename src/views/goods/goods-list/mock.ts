import Mock from 'mockjs';
import qs from 'query-string';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import { GetParams } from '@/types/global';

const { Random } = Mock;
// id: string;
//   name: string;
//   coverImgUrl: string;
//   price: number;
//   discount: number;
//   stock: number;
//   descImgUrlList: string[];
//   originPlace: string;
//   level: string;
//   weight: number;
//   desc: string;
//   categoryId: string;
const data = Mock.mock({
  'list|55': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'name|4-8': /[A-Z]/,
      'coverImgUrl':
        'https://avatars.githubusercontent.com/u/59254996?s=40&v=4',
      'price|100-1000': 1,
      'discount|0-100': 1,
      'stock|100-1000': 1,
      'descImgUrlList|3': [
        'https://avatars.githubusercontent.com/u/59254996?s=40&v=4',
      ],
      //   'number|2-3': /[0-9]/,
      //   'contentType|1': ['img', 'horizontalVideo', 'verticalVideo'],
      //   'count|2-3': /[0-9]/,
      //   'status|1': ['online', 'offline'],
      //   'filterType|1': ['artificial', 'rules'],
      'createdTime': Random.datetime(),
    },
  ],
});

// setupMock({
//   setup() {
//     Mock.mock(new RegExp('/goods/shopId/'), (params: GetParams) => {
//       const { page = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
//       const p = page as number;
//       const ps = pageSize as number;
//       return successResponseWrap({
//         content: data.list.slice((p - 1) * ps, p * ps),
//         total: 55,
//       });
//     });
//   },
// });

const categoryData = Mock.mock({
  'list|7': [
    {
      'id|8': /[A-Z][a-z][-][0-9]/,
      'name|4-8': /[A-Z]/,
    },
  ],
});

// setupMock({
//   setup() {
//     Mock.mock(new RegExp('/goods/category/'), (params: GetParams) => {
//       const { page = 1, pageSize = 10 } = qs.parseUrl(params.url).query;
//       const p = page as number;
//       const ps = pageSize as number;
//       return successResponseWrap(categoryData.list.slice((p - 1) * ps, p * ps));
//     });
//   },
// });

// setupMock({
//   setup() {
//     Mock.mock(new RegExp('/goods/file'), () => {
//       return successResponseWrap(Random.url('http'));
//     });
//   },
// });
