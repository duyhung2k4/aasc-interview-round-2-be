import axios from 'axios'
import type { AxiosRequestConfig, AxiosError } from 'axios'

export class QueryUtils {
    async axiosBaseQuery<T>(payload: PayloadQuery): Promise<T | Error> {
        try {
            const result = await axios({
                url: `${payload.baseUrl}/${payload.data.url}`,
                method: payload.data.method,
                data: payload.data.data,
                params: payload.data.params,
            })
            return result.data;
        } catch (axiosError) {
            const err = axiosError as AxiosError
            return err;
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