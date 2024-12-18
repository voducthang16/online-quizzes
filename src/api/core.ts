import { ApiRequestModel, ApiResponseModel } from '@/models';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: "https://d3e6-171-232-236-246.ngrok-free.app/api/",
    headers: {
        'Content-Type': 'application/json',
    },
    httpsAgent: {
        rejectUnauthorized: false,
    }
});

api.interceptors.request.use(
    config => {
        config.headers['ngrok-skip-browser-warning'] = 'true';
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);

export const BaseService = {
    get<T>({ url, payload, headers = {} }: Partial<ApiRequestModel>): Promise<AxiosResponse<ApiResponseModel<T>>> {
        return api.get<ApiResponseModel<T>>(url, {
            params: payload,
            headers,
        });
    },
    post<T>({ url, payload, headers = {} }: Partial<ApiRequestModel>): Promise<AxiosResponse<ApiResponseModel<T>>> {
        return api.post<ApiResponseModel<T>>(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        });
    },
    put<T>({ url, payload, headers = {} }: Partial<ApiRequestModel>): Promise<AxiosResponse<ApiResponseModel<T>>> {
        return api.put<ApiResponseModel<T>>(url, payload, { headers });
    },
    patch<T>({ url, payload, headers = {} }: Partial<ApiRequestModel>): Promise<AxiosResponse<ApiResponseModel<T>>> {
        return api.patch<ApiResponseModel<T>>(url, payload, { headers });
    },
    delete<T>({ url, payload, headers = {} }: Partial<ApiRequestModel>): Promise<AxiosResponse<ApiResponseModel<T>>> {
        return api.delete<ApiResponseModel<T>>(url, {
            params: payload,
            headers,
        });
    }
};
