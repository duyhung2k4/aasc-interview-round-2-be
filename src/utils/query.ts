import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export class QueryUtils {
    async axiosBaseQuery<T>(payload: PayloadQuery): Promise<T | Error> {
        console.log(`${payload.baseUrl}${payload.data.url}`)
        try {
            const result = await axios({
                url: `${payload.baseUrl}${payload.data.url}`,
                method: payload.data.method,
                data: payload.data.data,
                params: payload.data.params,
            });
            return result.data;
        } catch (axiosError) {
            return axiosError as AxiosError;
        }
    }
}

export type PayloadQuery = {
    baseUrl: string,
    data: {
        url: string
        method: AxiosRequestConfig['method']
        data?: AxiosRequestConfig['data']
        params?: AxiosRequestConfig['params']
    }
}