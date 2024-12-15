import { API } from "@/constants";
import { ApiRequestModel, BankModel } from "@/models";
import { BaseService } from "../core";

export const BankApi = {
    createBank(request: Partial<ApiRequestModel<BankModel>>) {
        console.log(request);
        return BaseService.post<BankModel>({
            url: API.QUESTION_BANK.CREATE,
            ...request,
        });
    },

    getAllBanks() {
        return BaseService.get<BankModel[]>({
            url: API.QUESTION_BANK.GET_ALL,
        });
    },

    getBankDetail(id: string) {
        return BaseService.get<BankModel>({
            url: API.QUESTION_BANK.GET_DETAIL.format(id),
        });
    },

    updateBank(request: Partial<ApiRequestModel<BankModel>>) {
        return BaseService.put<BankModel>({
            url: API.QUESTION_BANK.UPDATE.format(request.payload.question_bank_id),
            ...request,
        });
    },

    deleteBank(id: number) {
        return BaseService.delete<void>({
            url: API.QUESTION_BANK.DELETE.format(id),
        });
    },

    getBanksByUser(userId: string) {
        return BaseService.get<BankModel[]>({
            url: API.QUESTION_BANK.GET_QUESTION_BANK_BY_USER.format(userId),
        });
    }
};