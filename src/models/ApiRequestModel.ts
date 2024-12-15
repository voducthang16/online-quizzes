import { AxiosRequestConfig } from "axios";
import { BaseModel } from "./BaseModel";

export interface ApiRequestModel<T extends Partial<BaseModel> = {}> extends AxiosRequestConfig {
    payload?: Partial<T>;
    headers: {
        [key: string]: string | number;
    };
    url: string;
};


export interface ApiResponseModel<T> {
    code: number;
    message: string;
    data: T;
}