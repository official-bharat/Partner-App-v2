import { LoaderEvent } from '../../types/event';

/**
 * @author <Aniket.P>
 * @description HTTP service interface
 * @copyright Supra International, inc
 */
export interface IHttpService {

    post<T = any>(request: ApiRequest): Promise<ApiResponse<T>>;

    get<T = any>(request: ApiRequest): Promise<ApiResponse<T>>;

    put<T = any>(request: ApiRequest): Promise<ApiResponse<T>>;

    delete<T = any>(request: ApiRequest): Promise<ApiResponse<T>>;
}

export interface ApiRequest {
    baseURL: string;
    url: string;
    headers?: any;
    params?: any;
    data?: any;
    method?: 'POST' | 'GET' | 'PUT' | 'DELETE';
    timeout?: number;
    loaderEvent?: LoaderEvent;
    responseType?: 'arraybuffer';
}

export interface ApiResponse<T> {
    success: boolean;
    errorCode?: string;
    errors?: any[];
    data?: T;
    statusCode?: number;
    headers?: any;
    statusText?: any;
    totalCount?: number;
}