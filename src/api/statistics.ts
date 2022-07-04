/* eslint-disable import/prefer-default-export */
/* eslint-disable prettier/prettier */
import { number } from '@intlify/core-base';
import axios, { AxiosResponse } from 'axios';
import qs from 'query-string';
import dayjs from 'dayjs';

export interface UserSummaryRecord {
    date: string;
    connectType: string;
    count: number;
}
export interface UserSummaryParam {
    n: number
    type: string
    // type: '浏览' | '喜欢' | '收藏' 
}
export function getUserSummary(params: UserSummaryParam) {
    return new Promise<AxiosResponse<UserSummaryRecord[], any>>((resolve, reject) => {
        axios.get<UserSummaryRecord[]>('/news/statistics/userSummary', {
        params,
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        }}).then((res) => {
            res.data = res.data.filter(x => x.connectType === params.type)
            let beginDate = dayjs().subtract(params.n - 1, 'day')
            console.log(res.data)
            console.log(beginDate)
            for (let i=0;i<params.n;i+=1) {
                const date = res.data.at(i)?.date
                const dateStr = beginDate.format('YYYY-MM-DD')
                if (date === undefined || dateStr !== date) {
                    res.data.splice(i, 0, {date: dateStr, count: 0, connectType: params.type})
                }
                beginDate = beginDate.add(1, 'day')
            }
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    });
}