import { ApiRequestModel, QuestionModel } from "@/models";
import { BaseService } from "../core";
import { API } from "@/constants";

interface uploadQuestionProps {
    question: string;
    user_id: number;
    question_bank_id: number;
}

export const QuestionListApi = {
    createQuestion(request: Partial<ApiRequestModel<QuestionModel>>) {
        return BaseService.post<QuestionModel>({
            url: API.QUESTION_LIST.CREATE,
            ...request,
        });
    },

    getAllQuestions() {
        return BaseService.get<QuestionModel[]>({
            url: API.QUESTION_LIST.GET_ALL,
        });
    },

    updateQuestion(request: Partial<ApiRequestModel<QuestionModel>>) {
        return BaseService.put<QuestionModel>({
            url: API.QUESTION_LIST.UPDATE.format(request.payload.question_id),
            ...request,
        });
    },

    deleteQuestion(id: number) {
        return BaseService.delete<void>({
            url: API.QUESTION_LIST.DELETE.format(id),
        });
    },

    uploadQuestions(request: uploadQuestionProps) {
        return BaseService.post<void>({
            url: API.QUESTION_LIST.UPLOAD,
            payload: request,
        });
    },

    getQuestionByUser(userId: number) {
        return BaseService.get<QuestionModel[]>({
            url: API.QUESTION_LIST.GET_QUESTION_BY_USER_ID.format(userId),
        });
    },

};