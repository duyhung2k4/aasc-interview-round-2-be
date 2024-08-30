import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export class QueryUtils {
    async axiosBaseQuery<T>(payload: PayloadQuery): Promise<T | Error> {
        try {
            const result = await axios({
                url: `${payload.baseUrl}${payload.data.url}`,
                method: payload.data.method,
                data: payload.data.data,
                params: payload.data.params,
                timeout: 10000,
            });

            return result.data;
        } catch (axiosError) {
            const error = axiosError as AxiosError;
            return new Error(JSON.stringify(error?.response?.data));
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