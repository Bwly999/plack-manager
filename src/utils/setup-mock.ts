import debug from './env';

export default ({ mock, setup }: { mock?: boolean; setup: () => void }) => {
  if (mock !== false && debug) setup();
};

export const successResponseWrap = (data: unknown) => {
  return {
    data,
    errmsg: '成功',
    errno: 0,
  };
};

export const failResponseWrap = (
  data: unknown,
  errmsg: string,
  errno = 50000
) => {
  return {
    data,
    errmsg,
    errno,
  };
};
