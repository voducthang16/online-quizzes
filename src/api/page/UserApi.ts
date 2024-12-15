import { ApiRequestModel, UserModel } from "@/models";
import { BaseService } from "../core";
import { API } from "@/constants";

export const UserApi = {
    createUser(request: Partial<ApiRequestModel<UserModel>>) {
        return BaseService.post<UserModel>({
            url: API.USER.REGISTER,
            ...request,
        });
    },

    login(request: Partial<ApiRequestModel<UserModel>>) {
        return BaseService.post<UserModel>({
            url: API.USER.LOGIN,
            ...request,
        });
    },

    getAllUsers() {
        return BaseService.get<UserModel[]>({
            url: API.USER.GET_ALL,
        });
    },

    getAllTeachers() {
        return BaseService.get<UserModel[]>({
            url: API.USER.GET_ALL_TEACHERS,
        });
    },

    updateUser(request: Partial<ApiRequestModel<UserModel>>) {
        return BaseService.put<UserModel>({
            url: API.USER.UPDATE.format(request.payload.user_id),
            ...request,
        });
    },

}