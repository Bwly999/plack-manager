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
interface ProportionParam {
    n: number;
    type: string
}
export function getUserVisitProportion(params: ProportionParam) {
    return axios.get<{
        name: string;
        count: number
    }[]>('/news/statistics/userSummary/proportion', {
        params,
        paramsSerializer: (obj) => {
        return qs.stringify(obj);
        }
    })
}

export function getUserVisitNum(params: {n: number}) {
    return axios.get<{
        connectType: string;
        count: number
    }[]>('/news/statistics/userSummary/num', {
        params,
        paramsSerializer: (obj) => {
        return qs.stringify(obj);
        }
    })
}
export function getNewsCount(params: {beginDate?: string; endDate?: string}) {
    return axios.get<number>('/news/statistics/count', {
        params,
        paramsSerializer: (obj) => {
        return qs.stringify(obj);
        }
    })
}

function fillTimeData(n: number, data:any[]) {
    let beginDate = dayjs().subtract(n - 1, 'day');
    for (let i = 0; i < n; i += 1) {
        const date = data.at(i)?.date;
        const dateStr = beginDate.format('YYYY-MM-DD');
        if (date === undefined || dateStr !== date) {
            data.splice(i, 0, { date: dateStr, count: 0 });
        }
        beginDate = beginDate.add(1, 'day');
    }
    return data
}

export function getNewsAddition(params: {n: number}) {
    return new Promise<AxiosResponse<{date: string; count: number}[], any>>((resolve, reject) => {
        axios.get<{date: string; count: number}[]>('/news/statistics/count/addition/day', {
        params,
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        }}).then((res) => {
            fillTimeData(params.n, res.data);
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    });
}
export function getUserSummaryAll(params: {n: number}) {
    return new Promise<AxiosResponse<any, any>>((resolve, reject) => {
        axios.get<any>('/news/statistics/userSummary', {
        params,
        paramsSerializer: (obj) => {
          return qs.stringify(obj);
        }}).then((res) => {
            const browseData = res.data.filter((x: any) => x.connectType === '浏览')
            const favorData = res.data.filter((x: any) => x.connectType === '喜欢')
            const collectData = res.data.filter((x: any) => x.connectType === '收藏')
            fillTimeData(params.n, browseData);
            fillTimeData(params.n, favorData);
            fillTimeData(params.n, collectData);
            const data = [
                {
                    name: '浏览',
                    date: browseData.map((x: { date: any; }) => x.date),
                    count: browseData.map((x: { count: any; }) => x.count),
                },
                {
                    name: '喜欢',
                    date: favorData.map((x: { date: any; }) => x.date),
                    count: favorData.map((x: { count: any; }) => x.count),
                },
                {
                    name: '收藏',
                    date: collectData.map((x: { date: any; }) => x.date),
                    count: collectData.map((x: { count: any; }) => x.count),
                }
            ]
            res.data = data
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    });
}

export function getNewsTypeCount(params: {beginDate?: string; endDate?: string}) {
    return axios.get<{
        newsType:string
        count: number
    }[]>('/news/statistics/type/count', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        }
    })
}

export function getUserAllNewsTypeProportion(params: {n?: number}) {
    return axios.get<{
        newsType:string
        browseCount: number
        favorCount: number
        collectCount: number
    }[]>('/news/statistics/userSummary/newsType/proportion', {
        params,
        paramsSerializer: (obj) => {
            return qs.stringify(obj);
        }
    })
}